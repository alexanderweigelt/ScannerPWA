'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCamera } from './useCamera';

interface CameraPreviewProps {
  onError?: (error: string) => void;

  /**
   * Only called when the user accepts the scan.
   * (You can then trigger the PDF export here later.)
   */
  onCapture?: (imageData: string) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onError, onCapture }) => {
  const { error, isActive, startCamera, stopCamera, captureFrame, videoRef } = useCamera();
  const [pendingScan, setPendingScan] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const stopPreviewLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const drawLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = previewCanvasRef.current;

    if (!video || !canvas || !isActive || pendingScan) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    // Noch nicht ready
    if (!vw || !vh || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    if (canvas.width !== vw) canvas.width = vw;
    if (canvas.height !== vh) canvas.height = vh;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, vw, vh);
    }

    rafRef.current = requestAnimationFrame(drawLoop);
  }, [isActive, pendingScan, videoRef]);

  useEffect(() => {
    if (isActive && !pendingScan) {
      stopPreviewLoop();
      rafRef.current = requestAnimationFrame(drawLoop);
    } else {
      stopPreviewLoop();
    }
  }, [isActive, pendingScan, drawLoop, stopPreviewLoop]);

  useEffect(() => {
    return () => {
      stopPreviewLoop();
      stopCamera();
    };
  }, [stopPreviewLoop, stopCamera]);

  useEffect(() => {
    if (error) onError?.(error);
  }, [error, onError]);

  const handleCapture = () => {
    const scannedDataUrl = captureFrame(); // OpenCV-Scan (oder Fallback)
    if (!scannedDataUrl) return;

    setPendingScan(scannedDataUrl);

    requestAnimationFrame(() => {
      stopCamera();
    });
  };

  const handleAccept = () => {
    if (!pendingScan) return;
    onCapture?.(pendingScan);
  };

  const handleRescan = async () => {
    setPendingScan(null);
    await startCamera();
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {!isActive && !pendingScan && (
        <button
          onClick={startCamera}
          className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Start Camera
        </button>
      )}

      {isActive && !pendingScan && (
        <>
          <canvas
            ref={previewCanvasRef}
            className="w-full max-w-2xl rounded-lg bg-black aspect-video object-cover"
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleCapture}
              className="px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Capture Scan
            </button>

            <button
              onClick={stopCamera}
              className="px-5 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              Stop Camera
            </button>
          </div>
        </>
      )}

      {pendingScan && (
        <>
          <img
            src={pendingScan}
            alt="Scanned document preview"
            className="w-full max-w-2xl rounded-lg bg-black aspect-video object-contain"
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Accept Scan
            </button>

            <button
              onClick={handleRescan}
              className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Scan Again
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="w-full max-w-2xl px-3 py-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
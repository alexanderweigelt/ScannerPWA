'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCamera } from './useCamera';

interface CameraPreviewProps {
  onError?: (error: string) => void;
  onStop?: () => void;

  /**
   * Only called when the user accepts the scan.
   * @todo: You can then trigger the PDF export here later
   */
  onCapture?: (imageData: string) => void;
  isOpenCVReady?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onError, onCapture, onStop, isOpenCVReady }) => {
  const { error, isActive, startCamera, stopCamera, captureFrame, videoRef } = useCamera(isOpenCVReady);
  const [pendingScan, setPendingScan] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const drawLoopRef = useRef<(() => void) | null>(null);

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

    if (!vw || !vh || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(() => drawLoopRef.current?.());
      return;
    }

    const needsRotation = vw > vh && window.innerWidth < window.innerHeight;
    const canvasW = needsRotation ? vh : vw;
    const canvasH = needsRotation ? vw : vh;

    if (canvas.width !== canvasW) canvas.width = canvasW;
    if (canvas.height !== canvasH) canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (needsRotation) {
        // Rotate 90° CCW to correct the CW-rotated landscape stream
        ctx.save();
        ctx.translate(0, canvasH);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(video, 0, 0, vw, vh);
        ctx.restore();
      } else {
        ctx.drawImage(video, 0, 0, vw, vh);
      }
    }

    rafRef.current = requestAnimationFrame(() => drawLoopRef.current?.());
  }, [isActive, pendingScan, videoRef]);

  useEffect(() => {
    drawLoopRef.current = drawLoop;
  }, [drawLoop]);

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
    const canvas = previewCanvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) {
      console.warn("Canvas not ready for capture");
      return;
    }

    const scannedDataUrl = captureFrame(canvas);
    
    if (!scannedDataUrl) {
      console.error("Failed to capture frame");
      return;
    }

    setPendingScan(scannedDataUrl);
    onCapture?.(scannedDataUrl);
    stopCamera();
  };

  const handleAccept = () => {
    if (!pendingScan) return;
    onCapture?.(pendingScan);
    // Note: We don't setPendingScan(null) here because the user wants to see it until they scan again or stop.
    // Actually, the issue says: "sicher gestellt werden, dass eine Vorschau des scan im Browser angezeigt wird, die dann später als Bild <img> weiter verwendet werden kann."
    // If we clear it on accept, it disappears.
  };

  const handleRescan = async () => {
    setPendingScan(null);
    await startCamera();
  };

  const handleStopCamera = () => {
    setPendingScan(null);
    stopCamera();
    onStop?.();
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {!isActive && !pendingScan && (
        <button
          onClick={startCamera}
          data-testid="start-camera-button"
          className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Start Camera
        </button>
      )}

      {(isActive || pendingScan) && (
        <div className="flex justify-center">
          <button
            onClick={handleStopCamera}
            data-testid="stop-button"
            className="px-5 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            Stop Camera
          </button>
        </div>
      )}

      {isActive && !pendingScan && (
        <>
          <div className="relative w-full max-w-2xl mx-auto">
            <canvas
              ref={previewCanvasRef}
              data-testid="preview-canvas"
              className="w-full block rounded-lg bg-black"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="relative"
                style={{ aspectRatio: '210 / 297', width: '85%', maxHeight: '85%' }}
              >
                <div className="absolute inset-0 border border-white/25 rounded-sm" />
                <span className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-white" />
                <span className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-white" />
                <span className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-white" />
                <span className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-white" />
                <span className="absolute -bottom-6 inset-x-0 text-center text-xs text-white/60 whitespace-nowrap">
                  Position A4 document upright within the frame
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCapture}
              data-testid="capture-button"
              className="px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Capture Scan
            </button>
          </div>
        </>
      )}

      {pendingScan && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingScan}
            data-testid="scan-result-image"
            alt="Scanned document preview"
            className="max-w-full max-h-[75vh] mx-auto block rounded-lg bg-black object-contain"
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={handleAccept}
              data-testid="accept-scan-button"
              className="px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Accept Scan
            </button>

            <button
              onClick={handleRescan}
              data-testid="scan-again-button"
              className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Scan Again
            </button>
          </div>
        </>
      )}

      {error && (
        <div 
          data-testid="error-message"
          className="w-full max-w-2xl px-3 py-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md"
        >
          {error}
        </div>
      )}
    </div>
  );
};
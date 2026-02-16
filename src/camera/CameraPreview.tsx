'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCamera } from './useCamera';

interface CameraPreviewProps {
  onError?: (error: string) => void;
  onCapture?: (imageData: string) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ onError, onCapture }) => {
  const { streamRef, error, isActive, startCamera, stopCamera, captureFrame, videoRef } = useCamera();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Draw video frames to canvas continuously
  const drawCanvasFrame = useCallback(() => {
    if (canvasRef.current && videoElementRef.current && isActive && !capturedImage) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(
          videoElementRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      animationFrameRef.current = requestAnimationFrame(drawCanvasFrame);
    }
  }, [isActive, capturedImage]);

  useEffect(() => {
    if (isActive && videoElementRef.current && streamRef.current) {
      videoElementRef.current.srcObject = streamRef.current;
      Object.assign(videoRef, { current: videoElementRef.current });

      videoElementRef.current.onloadedmetadata = () => {
        if (canvasRef.current) {
          canvasRef.current.width = videoElementRef.current!.videoWidth;
          canvasRef.current.height = videoElementRef.current!.videoHeight;
          drawCanvasFrame();
        }
      };}
  }, [isActive, streamRef, videoRef, drawCanvasFrame]);

  useEffect(() => {
    if (!capturedImage && isActive) {
      drawCanvasFrame();
    } else if (capturedImage && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [capturedImage, isActive, drawCanvasFrame]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleCapture = () => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageData);
      if (onCapture) {
        onCapture(imageData);
      }
    }
  };

  const handleClearCapture = () => {
    setCapturedImage(null);
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {!isActive && (
        <button
          onClick={startCamera}
          className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Start Camera
        </button>
      )}

      {isActive && !capturedImage && (
        <>
          <video
            ref={videoElementRef}
            autoPlay
            playsInline
            muted
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            className="w-full max-w-2xl rounded-lg bg-black aspect-video object-cover"
          />
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleCapture}
              className="px-5 py-2 text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Capture Frame
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

      {capturedImage && (
        <>
          <img
            src={capturedImage}
            alt="Captured frame"
            className="w-full max-w-2xl rounded-lg bg-black aspect-video object-contain"
          />
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleClearCapture}
              className="px-5 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Capture Again
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

      {error && (
        <div className="w-full max-w-2xl px-3 py-3 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

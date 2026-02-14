'use client';
import React, {useEffect, useRef} from 'react';
import {useCamera} from './useCamera';

interface CameraPreviewProps {
  onError?: (error: string) => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({onError}) => {
  const {streamRef, error, isActive, startCamera, stopCamera} = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isActive, streamRef]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {!isActive && (
        <button
          onClick={startCamera}
          className="px-5 py-2 text-base font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors cursor-pointer"
        >
          Start Camera
        </button>
      )}

      {isActive && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-2xl rounded-lg bg-black aspect-video object-cover"
          />
          <button
            onClick={stopCamera}
            className="px-5 py-2 text-base font-medium text-white bg-error-600 rounded-md hover:bg-error-500 transition-colors cursor-pointer"
          >
            Stop Camera
          </button>
        </>
      )}

      {error && (
        <div className="w-full max-w-2xl px-3 py-3 text-sm text-error-text bg-error-bg border border-error-border rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

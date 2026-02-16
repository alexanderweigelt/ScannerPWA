import { useRef, useCallback, useState } from 'react';

interface UseCameraReturn {
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useCamera = (): UseCameraReturn => {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      setIsActive(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access camera';
      setError(message);
      setIsActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsActive(false);
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95);
  }, []);

  return { streamRef, error, isActive, startCamera, stopCamera, captureFrame, videoRef };
};

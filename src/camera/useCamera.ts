import {useRef, useCallback, useState} from 'react';

interface UseCameraReturn {
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {facingMode: 'user'},
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

  return {streamRef, error, isActive, startCamera, stopCamera};
};

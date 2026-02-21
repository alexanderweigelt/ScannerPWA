import { useRef, useCallback, useState, useEffect } from "react";
import { getCv, scanIntoCanvas } from "@/src/scan/scanIntoCanvas";

interface UseCameraReturn {
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

async function getRearCameraStream() {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } },
      audio: false
    });
  } catch {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
    } catch {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
    }
  }
}

export const useCamera = (): UseCameraReturn => {
  const streamRef = useRef<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await getRearCameraStream();

      streamRef.current = stream;
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!frameCanvasRef.current) {
        frameCanvasRef.current = document.createElement("canvas");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    const resultCanvas = canvasRef.current;

    if (!video || !resultCanvas) return null;

    const frameCanvas = frameCanvasRef.current!;
    frameCanvas.width = video.videoWidth;
    frameCanvas.height = video.videoHeight;

    const ctx = frameCanvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const cv = getCv();

    if (cv) {
      const success = scanIntoCanvas(cv, frameCanvas, resultCanvas);

      if (success) {
        return resultCanvas.toDataURL("image/jpeg", 0.95);
      }
    }

    // fallback
    return frameCanvas.toDataURL("image/jpeg", 0.95);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  return {
    streamRef,
    error,
    isActive,
    startCamera,
    stopCamera,
    captureFrame,
    videoRef,
    canvasRef,
  };
};

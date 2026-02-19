import { useRef, useCallback, useState, useEffect } from "react";
import { scanIntoCanvas } from "@/src/scan/scanIntoCanvas";
import { requireOpenCV } from "@/src/types/opencv";

interface UseCameraReturn {
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  isActive: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureFrame: (sourceCanvas: HTMLCanvasElement) => string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
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

export const useCamera = (isOpenCVReady?: boolean): UseCameraReturn => {
  const streamRef = useRef<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await getRearCameraStream();

      streamRef.current = stream;
      setIsActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!resultCanvasRef.current) {
        resultCanvasRef.current = document.createElement("canvas");
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

  const captureFrame = useCallback((sourceCanvas: HTMLCanvasElement) => {
    const resultCanvas = resultCanvasRef.current;
    if (!resultCanvas) {
      resultCanvasRef.current = document.createElement("canvas");
    }
    const finalResultCanvas = resultCanvasRef.current!;

    const snapshot = document.createElement("canvas");
    snapshot.width = sourceCanvas.width;
    snapshot.height = sourceCanvas.height;
    const snapshotCtx = snapshot.getContext("2d");
    if (!snapshotCtx) {
      return null;
    }
    snapshotCtx.drawImage(sourceCanvas, 0, 0);

    const cv = requireOpenCV();

    if (cv && isOpenCVReady) {
      try {
        const success = scanIntoCanvas(cv, snapshot, finalResultCanvas);

        if (success) {
          return finalResultCanvas.toDataURL("image/jpeg", 0.95);
        }
      } catch (e) {
        console.error("OpenCV scan error:", e);
      }
    }

    // fallback: return the raw snapshot
    console.warn("OpenCV not available or scan failed, falling back to raw frame");
    return snapshot.toDataURL("image/jpeg", 0.95);
  }, [isOpenCVReady]);

  useEffect(() => stopCamera, [stopCamera]);

  return {
    streamRef,
    error,
    isActive,
    startCamera,
    stopCamera,
    captureFrame,
    videoRef,
  };
};

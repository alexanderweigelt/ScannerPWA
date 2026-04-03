import { useRef, useCallback, useState, useEffect } from "react";
import { runScanPipeline } from "@/src/scan/scanPipeline";
import { requireOpenCV } from "@/src/types/opencv";

interface UseCameraReturn {
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  scanError: string | null;
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
  const [scanError, setScanError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setScanError(null);
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

  const captureFrame = useCallback(
    (sourceCanvas: HTMLCanvasElement): string | null => {
      if (!resultCanvasRef.current) {
        resultCanvasRef.current = document.createElement("canvas");
      }
      const finalResultCanvas = resultCanvasRef.current;

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
        const result = runScanPipeline(cv, snapshot, finalResultCanvas);

        if (result.ok) {
          setScanError(null);
          return finalResultCanvas.toDataURL("image/jpeg", 0.95);
        }

        console.warn(`[scan] failed: ${result.reason} — ${result.message}`);
        setScanError(result.message);
      } else {
        setScanError(null);
      }

      // Fallback: return raw snapshot so the UI still has something to show
      return snapshot.toDataURL("image/jpeg", 0.95);
    },
    [isOpenCVReady]
  );

  useEffect(() => stopCamera, [stopCamera]);

  return {
    streamRef,
    error,
    scanError,
    isActive,
    startCamera,
    stopCamera,
    captureFrame,
    videoRef,
  };
};
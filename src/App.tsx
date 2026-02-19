'use client';

import { FC, useState } from "react";
import Script from 'next/script';
import { CameraPreview } from "@/src/camera/CameraPreview";
import type { OpenCVRuntimeAPI } from "@/src/types/opencv";

export const App: FC = () => {
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);

  function onOpenCvLoad() {
    const cv = (window as Window & { cv?: OpenCVRuntimeAPI }).cv;
    if (!cv) return;
    if (cv.Mat) {
      console.log("OpenCV.js already ready");
      setIsOpenCVReady(true);
      return;
    }
    cv.onRuntimeInitialized = () => {
      console.log("OpenCV.js ready");
      setIsOpenCVReady(true);
    };
  }

  return (
    <>
      <Script
        src="/vendor/opencv.js"
        strategy="afterInteractive"
        onLoad={onOpenCvLoad}
        async={true}
      />
      <CameraPreview isOpenCVReady={isOpenCVReady} />
    </>
  );
};

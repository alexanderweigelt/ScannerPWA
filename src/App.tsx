'use client';

import { FC } from "react";
import Script from 'next/script';
import { CameraPreview } from "@/src/camera/CameraPreview";

function onOpenCvLoad() {
  const cv = (window as any).cv;
  if (!cv) return;
  cv.onRuntimeInitialized = () => {
    console.log("OpenCV.js ready");
  };
}

export const App: FC = () => {
  return (
    <>
      <Script
        src="/vendor/opencv.js"
        strategy="afterInteractive"
        onLoad={onOpenCvLoad}
        async={true}
      />
      <CameraPreview />
    </>
  );
};

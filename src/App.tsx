import {FC} from "react";
import Script from 'next/script'
import {CameraPreview} from "@/src/camera/CameraPreview";

export const App:FC = () => {
  return (
    <>
      <Script src="https://docs.opencv.org/4.x/opencv.js" async={true} />
      <CameraPreview/>
    </>
)
}

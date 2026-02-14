import Image from "next/image";
import {App} from "@/src/App";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-100 font-sans dark:bg-brand-800">
      <main
        className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-8 md:py-32 md:px-16 px-4 bg-brand-50 dark:bg-brand-900 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="flex max-w-xs text-6xl gap-4 font-semibold leading-10 tracking-tight text-brand-800 dark:text-brand-50">
            <Image
              className="dark:invert"
              src="./scanner.svg"
              alt="Scanner PWA logo"
              width={48}
              height={20}
              priority
            />
            Scanner
          </h1>
          <p className="max-w-md text-lg leading-8 text-brand-600 dark:text-brand-400">
            A Scanner PWA that captures documents via camera, and exports scans as PDF.<br/>
            To get started, klick the button.
          </p>
          <App/>
        </div>
      </main>
    </div>
  );
}

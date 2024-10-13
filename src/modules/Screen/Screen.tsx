/* eslint-disable react/display-name */
import { FC, ReactNode, useRef } from "react";
import Image from "next/image";
import { WindowManagerProvider } from "../WindowManager";
import { useBackground } from "../Theme/Background";

interface ScreenProps {
  children: ReactNode;
  backgroundImage?: string;
}

export const Screen: FC<ScreenProps> = ({ children }) => {
  const screenRef = useRef(null);

  const { currentBackground } = useBackground();

  return (
    <div
      ref={screenRef}
      className="relative h-screen max-h-screen w-screen overflow-hidden"
    >
      <Image
        src={currentBackground}
        alt="Background"
        fill
        objectFit="cover"
        quality={100}
        className="z-0"
      />

      <WindowManagerProvider containerRef={screenRef}>
        <div className="relative z-10 size-full">{children}</div>
      </WindowManagerProvider>
    </div>
  );
};

/* eslint-disable react/display-name */
import { FC, ReactNode, useRef } from "react";
import Image from "next/image";
import IMGBackground from "@/assets/background.jpg";
import { WindowManagerProvider } from "../WindowManager";

interface ScreenProps {
  children: ReactNode;
  backgroundImage?: string;
}

export const Screen: FC<ScreenProps> = ({
  children,
  backgroundImage = IMGBackground,
}) => {
  const screenRef = useRef(null);

  return (
    <div
      ref={screenRef}
      className="max-w-screen relative h-screen max-h-screen w-screen overflow-hidden"
    >
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      <WindowManagerProvider containerRef={screenRef}>
        <div className="relative z-10 h-full w-full">{children}</div>
      </WindowManagerProvider>
    </div>
  );
};

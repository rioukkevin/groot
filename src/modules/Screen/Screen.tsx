"use client";

/* eslint-disable react/display-name */
import { FC, ReactNode, useRef } from "react";
import Image from "next/image";
import { WindowManagerProvider } from "../WindowManager";
import { useBackground } from "../Theme";
import { useUmami } from "@/lib/umami";

interface ScreenProps {
  children: ReactNode;
  backgroundImage?: string;
}

export const Screen: FC<ScreenProps> = ({ children }) => {
  const screenRef = useRef(null);

  const { track } = useUmami();

  const { currentBackground } = useBackground();

  return (
    <div
      ref={screenRef}
      className="relative h-screen max-h-screen min-h-[720px] w-screen min-w-[1280px] overflow-hidden"
    >
      <Image
        src={currentBackground}
        alt="Background"
        fill
        quality={100}
        className="z-0 object-cover"
        priority
        placeholder="blur"
        blurDataURL={currentBackground}
      />

      <WindowManagerProvider
        screenRef={screenRef}
        onOpenWindow={(window) =>
          track?.("windowOpen", {
            id: window.id,
            title: window.title,
            isFullscreenAllowed: window.isFullscreenAllowed,
          })
        }
        onCloseWindow={(window) =>
          track?.("windowClose", {
            id: window.id,
            title: window.title,
          })
        }
        onFocusWindow={(window) =>
          track?.("windowFocus", {
            id: window.id,
            title: window.title,
          })
        }
        onToggleFullscreen={(window) =>
          track?.("windowToggleFullscreen", {
            id: window.id,
            title: window.title,
            isFullscreen: window.isFullscreen,
          })
        }
      >
        <div className="relative z-10 size-full">{children}</div>
      </WindowManagerProvider>
    </div>
  );
};

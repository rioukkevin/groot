"use client";

/* eslint-disable react/display-name */
import Image from "next/image";
import { FC, ReactNode, useRef } from "react";

import { useUmami } from "@/lib/umami";

import { useBackground } from "../Theme";
import { WindowManagerProvider } from "../WindowManager";


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
        alt="Background"
        blurDataURL={currentBackground}
        className="z-0 object-cover"
        fill
        placeholder="blur"
        priority
        quality={100}
        src={currentBackground}
      />

      <WindowManagerProvider
        screenRef={screenRef}
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
        onOpenWindow={(window) =>
          track?.("windowOpen", {
            id: window.id,
            title: window.title,
            isFullscreenAllowed: window.isFullscreenAllowed,
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

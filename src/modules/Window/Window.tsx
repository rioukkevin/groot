"use client";

import { motion, useDragControls, useMotionValue } from "framer-motion";
import React, { FC, RefObject, useMemo, useRef, useState } from "react";


import { cn } from "@/lib/cn";
import { useScopedI18n } from "@/lib/locales/client";
import useScreenSize from "@/lib/screen";

import { BorderTrail } from "../BorderTrail";
import {
  useWindowActions,
  WindowPosition,
  WindowSize,
  WindowState,
} from "../WindowManager";

import { WindowButtonTooltip } from "./WindowButtonTooltip";

const FULLSCREEN_INSET = 0;

const getMaxSize = ({
  size,
  screenWidth,
  screenHeight,
  position,
}: {
  size?: WindowSize;
  screenWidth: number;
  screenHeight: number;
  position?: WindowPosition;
}) => {
  const maxWidth =
    screenWidth - ((position?.left ?? 0) + (position?.right ?? 0));
  const maxHeight =
    screenHeight - ((position?.top ?? 0) + (position?.bottom ?? 0));

  return {
    width: (size?.width ?? 0) > maxWidth ? maxWidth : size?.width,
    height: (size?.height ?? 0) > maxHeight ? maxHeight : size?.height,
  };
};

export const Window: FC<
  WindowState & { screenRef: RefObject<HTMLDivElement> }
> = ({
  title,
  id,
  component: Component,
  defaultSize,
  defaultPosition,
  isFullscreenAllowed,
  isFocused,
  isFullscreen,
  isOpened,
  screenRef,
}) => {
  const { focusSelf, closeSelf, toggleFullscreenSelf, register, unregister } =
    useWindowActions(id);
  const windowRef = useRef<HTMLDivElement>(null);

  const { width: screenWidth, height: screenHeight } = useScreenSize();

  const [previousTransformX, setPreviousTransformX] = useState(0);
  const [previousTransformY, setPreviousTransformY] = useState(0);

  const t = useScopedI18n("window");
  const closeHovered = useMotionValue(0);
  const minimizeHovered = useMotionValue(0);
  const maximizeHovered = useMotionValue(0);

  const dragControls = useDragControls();

  const startDrag = (event: React.PointerEvent<Element>) => {
    focusSelf();
    dragControls.start(event, { snapToCursor: false });
  };

  const handleDragEnd = () => {
    if (windowRef.current) {
      const matrix = new DOMMatrixReadOnly(windowRef.current.style.transform);
      setPreviousTransformX(matrix.m41);
      setPreviousTransformY(matrix.m42);
    }
  };

  const handleReduce = () => {
    if (isFullscreen) {
      toggleFullscreenSelf();
    } else closeSelf();
  };

  const maxSize = useMemo(() => {
    if (!defaultSize || !defaultPosition) return undefined;
    return getMaxSize({
      size: defaultSize,
      screenWidth,
      screenHeight,
      position: defaultPosition,
    });
  }, [defaultSize, screenWidth, screenHeight, defaultPosition]);

  if (!isOpened) return <></>;

  return (
    <motion.div
      key={id}
      ref={windowRef}
      animate={{
        opacity: 1,
        height: isFullscreen ? `100%` : (defaultSize?.height ?? "fit-content"),
        width: isFullscreen ? `100%` : (defaultSize?.width ?? "fit-content"),
        left: isFullscreen ? 0 - previousTransformX : undefined,
        top: isFullscreen ? 0 - previousTransformY : undefined,
        padding: isFullscreen ? FULLSCREEN_INSET : 0,
        filter: "blur(0px)",
        scaleY: 1,
      }}
      className={cn(
        "max-w-screen -m-1/2 pointer-events-none absolute max-h-full select-none overflow-hidden rounded-lg border border-transparent shadow-2xl brightness-75 backdrop-blur-md",
        isFocused && "z-40 select-auto border-neutral-200/30 brightness-100",
        !isFocused && "z-10",
      )}
      drag={!isFullscreen}
      dragConstraints={screenRef}
      dragControls={dragControls}
      dragElastic={0.1}
      dragListener={false}
      dragMomentum={false}
      exit={{
        opacity: 0,
        filter: "blur(10px)",
        scaleY: 0,
        width: maxSize?.width ?? "fit-content",
        height: maxSize?.height ?? "fit-content",
      }}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        scaleY: 0,
        width: maxSize?.width ?? "fit-content",
        height: maxSize?.height ?? "fit-content",
      }}
      style={{
        ...(defaultPosition?.left && { left: defaultPosition.left + "px" }),
        ...(defaultPosition?.top && { top: defaultPosition.top + "px" }),
        ...(defaultPosition?.right && {
          right: defaultPosition.right + "px",
        }),
        ...(defaultPosition?.bottom && {
          bottom: defaultPosition.bottom + "px",
        }),
      }}
      transition={{ type: "spring", bounce: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-lg bg-neutral-800/80",
        )}
      >
        {isFocused && <BorderTrail size={isFullscreen ? 250 : 60} />}
        <div
          className={cn(
            "pointer-events-auto flex items-center justify-between border-b border-neutral-600/20 bg-neutral-800/80 p-2",
            !isFullscreen && "cursor-grab",
          )}
          onClick={() => focusSelf()}
          onPointerDown={startDrag}
        >
          <div className="relative flex cursor-move select-none space-x-2">
            <motion.button
              aria-label={t("close")}
              className="size-3 rounded-full bg-red-500"
              onClick={() => closeSelf()}
              onHoverEnd={() => closeHovered.set(0)}
              onHoverStart={() => closeHovered.set(1)}
            >
              <WindowButtonTooltip isHovered={closeHovered}>
                {t("close")}
              </WindowButtonTooltip>
            </motion.button>
            {isFullscreenAllowed && (
              <>
                <motion.button
                  aria-label={t("minimize")}
                  className="size-3 cursor-zoom-out rounded-full bg-yellow-500"
                  onClick={handleReduce}
                  onHoverEnd={() => minimizeHovered.set(0)}
                  onHoverStart={() => minimizeHovered.set(1)}
                >
                  <WindowButtonTooltip isHovered={minimizeHovered}>
                    {t("minimize")}
                  </WindowButtonTooltip>
                </motion.button>
                <motion.button
                  aria-label={isFullscreen ? t("restore") : t("maximize")}
                  className={cn(
                    "h-3 w-3 cursor-zoom-in rounded-full bg-green-500",
                    isFullscreen && "cursor-default bg-gray-500",
                  )}
                  onClick={() => toggleFullscreenSelf()}
                  onHoverEnd={() => maximizeHovered.set(0)}
                  onHoverStart={() => maximizeHovered.set(1)}
                >
                  {!isFullscreen && (
                    <WindowButtonTooltip isHovered={maximizeHovered}>
                      {t("maximize")}
                    </WindowButtonTooltip>
                  )}
                </motion.button>
              </>
            )}
          </div>
          <div className="mx-4 select-none text-sm font-medium text-neutral-300">
            {title}
          </div>
          <div className={cn("w-16", !isFullscreenAllowed && "w-5")}></div>{" "}
        </div>
        <div
          className={cn(
            "pointer-events-auto relative h-[calc(100%-40px)] max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-hidden p-4",
          )}
          onClick={() => focusSelf()}
          onScroll={() => focusSelf()}
        >
          <div className="relative size-full">
            <Component
              {...{
                isFullscreen,
                id,
                isFocused,
                title,
                isOpened,
                defaultPosition,
                defaultSize,
                isFullscreenAllowed,
                registerWindows: register,
                unregisterWindows: unregister,
              }}
            />
            {!isFocused && <div className="absolute -inset-4 bg-black/30" />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

"use client";

import React, {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { WindowButtonTooltip } from "./WindowButtonTooltip";
import { cn } from "@/lib/cn";
import { useIsWindowFocused, useWindow } from "../WindowManager";
import { BorderTrail } from "../BorderTrail";
import { useScopedI18n } from "@/lib/locales/client";
import useScreenSize from "@/lib/screen";

const FULLSCREEN_INSET = 12;

export interface WindowChildrenProps {
  isFullscreen: boolean;
  id: string;
  isFocused: boolean;
  title: string;
}

export interface WindowProps {
  children: (props: WindowChildrenProps) => ReactNode;
  containerRef: RefObject<HTMLDivElement>;
  title?: string;
  id: string;
  isFocused?: boolean;
  isFullscreenAllowed?: boolean;
  size?: {
    width?: number;
    height?: number;
  };
  position?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
}

const getMaxSize = (
  size: WindowProps["size"],
  screenWidth: number,
  screenHeight: number,
  position: WindowProps["position"],
) => {
  const maxWidth =
    screenWidth - ((position?.left ?? 0) + (position?.right ?? 0));
  const maxHeight =
    screenHeight - ((position?.top ?? 0) + (position?.bottom ?? 0));

  return {
    width: (size?.width ?? 0) > maxWidth ? maxWidth : size?.width,
    height: (size?.height ?? 0) > maxHeight ? maxHeight : size?.height,
  };
};

export const Window: FC<WindowProps> = ({
  children,
  title = "Window Title",
  containerRef,
  id,
  isFocused,
  isFullscreenAllowed = false,
  size,
  position,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const t = useScopedI18n("window");

  const { width: screenWidth, height: screenHeight } = useScreenSize();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [previousTransformX, setPreviousTransformX] = useState(0);
  const [previousTransformY, setPreviousTransformY] = useState(0);

  const closeHovered = useMotionValue(0);
  const minimizeHovered = useMotionValue(0);
  const maximizeHovered = useMotionValue(0);

  const { focusWindow, closeWindow } = useWindow(id);
  const isFocusedWindow = useIsWindowFocused(id);

  const dragControls = useDragControls();

  useEffect(() => {
    if (!isFocusedWindow) {
      focusWindow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startDrag = (event: React.PointerEvent<Element>) => {
    if (!isFocusedWindow) {
      focusWindow();
    }
    dragControls.start(event, { snapToCursor: false });
  };

  const handleDragEnd = () => {
    if (windowRef.current) {
      const matrix = new DOMMatrixReadOnly(windowRef.current.style.transform);
      setPreviousTransformX(matrix.m41);
      setPreviousTransformY(matrix.m42);
    }
  };

  const handleMaximize = () => {
    setIsFullscreen(true);
  };

  const handleReduce = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
    } else closeWindow();
  };

  const handlePointerDown = () => {
    if (!isFocusedWindow) {
      focusWindow();
    }
  };

  const maxSize = useMemo(() => {
    return getMaxSize(size, screenWidth, screenHeight, position);
  }, [size, screenWidth, screenHeight, position]);

  return (
    <motion.div
      ref={windowRef}
      drag={!isFullscreen}
      dragConstraints={containerRef}
      dragElastic={0.1}
      className={cn(
        "max-w-screen -m-1/2 pointer-events-none absolute z-10 max-h-full select-none overflow-hidden rounded-lg shadow-lg brightness-75 backdrop-blur-md",
        isFocused && "z-30 select-auto brightness-100",
      )}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        scaleY: 0,
        width: maxSize?.width ?? "fit-content",
        height: maxSize?.height ?? "fit-content",
      }}
      animate={{
        opacity: 1,
        height: isFullscreen ? `100%` : (size?.height ?? "fit-content"),
        width: isFullscreen ? `100%` : (size?.width ?? "fit-content"),
        left: isFullscreen ? 0 - previousTransformX : undefined,
        top: isFullscreen ? 0 - previousTransformY : undefined,
        padding: isFullscreen ? FULLSCREEN_INSET : 0,
        filter: "blur(0px)",
        scaleY: 1,
      }}
      exit={{
        opacity: 0,
        filter: "blur(10px)",
        scaleY: 0,
        width: maxSize?.width ?? "fit-content",
        height: maxSize?.height ?? "fit-content",
      }}
      transition={{ type: "spring", bounce: 0 }}
      key={id}
      style={{
        ...(position?.left && { left: position.left + "px" }),
        ...(position?.top && { top: position.top + "px" }),
        ...(position?.right && { right: position.right + "px" }),
        ...(position?.bottom && { bottom: position.bottom + "px" }),
      }}
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
          onPointerDown={startDrag}
          onClick={handlePointerDown}
        >
          <div className="relative flex cursor-move select-none space-x-2">
            <motion.button
              className="size-3 rounded-full bg-red-500"
              aria-label={t("close")}
              onHoverStart={() => closeHovered.set(1)}
              onHoverEnd={() => closeHovered.set(0)}
              onClick={() => closeWindow()}
            >
              <WindowButtonTooltip isHovered={closeHovered}>
                {t("close")}
              </WindowButtonTooltip>
            </motion.button>
            {isFullscreenAllowed && (
              <>
                <motion.button
                  className="size-3 cursor-zoom-out rounded-full bg-yellow-500"
                  aria-label={t("minimize")}
                  onHoverStart={() => minimizeHovered.set(1)}
                  onHoverEnd={() => minimizeHovered.set(0)}
                  onClick={handleReduce}
                >
                  <WindowButtonTooltip isHovered={minimizeHovered}>
                    {t("minimize")}
                  </WindowButtonTooltip>
                </motion.button>
                <motion.button
                  className={cn(
                    "h-3 w-3 cursor-zoom-in rounded-full bg-green-500",
                    isFullscreen && "cursor-default bg-gray-500",
                  )}
                  aria-label={isFullscreen ? t("restore") : t("maximize")}
                  onHoverStart={() => maximizeHovered.set(1)}
                  onHoverEnd={() => maximizeHovered.set(0)}
                  onClick={handleMaximize}
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
          {/* Spacer to balance the title */}
        </div>
        <div
          className={cn(
            "pointer-events-auto h-[calc(100%-40px)] max-h-[calc(100vh-40px)] overflow-y-auto overflow-x-hidden p-4",
          )}
          onClick={handlePointerDown}
        >
          {children({
            isFullscreen,
            id,
            isFocused: !!isFocused,
            title,
          })}
        </div>
      </div>
    </motion.div>
  );
};

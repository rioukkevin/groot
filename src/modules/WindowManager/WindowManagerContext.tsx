"use client";

import { AnimatePresence } from "framer-motion";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  RefObject,
  FC,
} from "react";

import { Window } from "../Window";

export interface WindowComponentProps
  extends Pick<
    WindowState,
    | "id"
    | "title"
    | "isFocused"
    | "isFullscreen"
    | "isOpened"
    | "defaultSize"
    | "defaultPosition"
    | "isFullscreenAllowed"
  > {
  registerWindows: (windows: WindowProps[]) => string[];
  unregisterWindows: (ids: string[]) => void;
}

export interface WindowPosition {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
}

export interface WindowSize {
  width?: number;
  height?: number;
}

export interface WindowProps {
  id: string;
  title: string;
  component: FC<WindowComponentProps>;
  defaultSize?: WindowSize;
  defaultPosition?: WindowPosition;
  isFullscreenAllowed?: boolean;
}

export interface WindowState extends WindowProps {
  isOpened: boolean;
  isFocused: boolean;
  isFullscreen: boolean;
}

interface WindowManagerContextType {
  windows: WindowState[];
  registerWindows: (windows: WindowProps[]) => string[];
  unregisterWindows: (ids: string[]) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleFullscreen: (id: string) => void;
  screenRef: RefObject<HTMLDivElement>;
}

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

interface WindowManagerProviderProps {
  children: ReactNode;
  screenRef: RefObject<HTMLDivElement>;
  onOpenWindow?: (window: WindowState) => void;
  onCloseWindow?: (window: WindowState) => void;
  onFocusWindow?: (window: WindowState) => void;
  onToggleFullscreen?: (window: WindowState) => void;
}

export const WindowManagerProvider: FC<WindowManagerProviderProps> = ({
  children,
  screenRef,
  onOpenWindow,
  onCloseWindow,
  onFocusWindow,
  onToggleFullscreen,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([]);

  const registerWindows = useCallback((newWindows: WindowProps[]) => {
    const registeredIds: string[] = [];
    setWindows((prev) => {
      const uniqueNewWindows = newWindows.filter(
        (newWindow) => !prev.some((w) => w.id === newWindow.id),
      );
      registeredIds.push(...uniqueNewWindows.map((w) => w.id));
      return [
        ...prev,
        ...uniqueNewWindows.map((window) => ({
          ...window,
          isOpened: false,
          isFocused: false,
          isFullscreen: false,
        })),
      ];
    });
    return registeredIds;
  }, []);

  const unregisterWindows = useCallback((ids: string[]) => {
    setWindows((prev) => prev.filter((window) => !ids.includes(window.id)));
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);

      if (window && !window.isOpened) {
        onOpenWindow?.(window);
        return prev.map((w) => (w.id === id ? { ...w, isOpened: true } : w));
      }
      return prev;
    });
    setTimeout(() => focusWindow(id), 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (window && window.isOpened) {
        onCloseWindow?.(window);
        return prev.map((w) =>
          w.id === id
            ? { ...w, isOpened: false, isFocused: false, isFullscreen: false }
            : w,
        );
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (window && window.isOpened && !window.isFocused) {
        onFocusWindow?.(window);
        return prev.map((w) =>
          w.id === id ? { ...w, isFocused: true } : { ...w, isFocused: false },
        );
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFullscreen = useCallback((id: string) => {
    setWindows((prev) => {
      const window = prev.find((w) => w.id === id);
      if (window && window.isFullscreenAllowed && window.isOpened) {
        onToggleFullscreen?.(window);
        return prev.map((w) =>
          w.id === id ? { ...w, isFullscreen: !w.isFullscreen } : w,
        );
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    windows,
    registerWindows,
    unregisterWindows,
    openWindow,
    closeWindow,
    focusWindow,
    toggleFullscreen,
    screenRef,
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager2 must be used within a WindowManagerProvider2",
    );
  }
  return context;
};

export const useRootWindow = () => {
  const { registerWindows, unregisterWindows, openWindow } = useWindowManager();
  return { registerWindows, unregisterWindows, openWindow };
};

export const useWindowCountById = (id: string) => {
  const { windows } = useWindowManager();
  return windows.filter(
    (window) => window.id.includes(id) && window.isOpened === true,
  ).length;
};

export const useWindowActions = (id: string) => {
  const {
    openWindow,
    closeWindow,
    focusWindow,
    toggleFullscreen: toggleFullscrenWindow,
    registerWindows,
    unregisterWindows,
  } = useWindowManager();

  const register = useCallback(
    (windowProps: WindowProps[]) => {
      const newWindows = windowProps.map((window) => ({
        ...window,
        id: `${id}:${window.id}`,
      }));
      return registerWindows(newWindows);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registerWindows],
  );

  const unregister = useCallback(unregisterWindows, [unregisterWindows]);

  const open = useCallback(
    (windowId: string) => openWindow(`${id}:${windowId}`),
    [openWindow, id],
  );

  const close = useCallback(
    (windowId: string) => closeWindow(`${id}:${windowId}`),
    [closeWindow, id],
  );
  const focus = useCallback(
    (windowId: string) => focusWindow(`${id}:${windowId}`),
    [focusWindow, id],
  );
  const toggleFullscreen = useCallback(
    (windowId: string) => toggleFullscrenWindow(`${id}:${windowId}`),
    [toggleFullscrenWindow, id],
  );

  return {
    open,
    openSelf: () => openWindow(id),
    close,
    closeSelf: () => closeWindow(id),
    focus,
    focusSelf: () => focusWindow(id),
    toggleFullscreen,
    toggleFullscreenSelf: () => toggleFullscrenWindow(id),
    register,
    unregister,
  };
};

export const useWindowScreenRef = () => {
  const { screenRef } = useWindowManager();
  return screenRef;
};

export const useWindowState = (id: string) => {
  const { windows } = useWindowManager();
  const window = windows.find((window) => window.id === id);

  if (!window) return null;

  const {
    isOpened,
    isFocused,
    isFullscreen,
    title,
    defaultSize,
    defaultPosition,
    isFullscreenAllowed,
  } = window;

  return {
    id,
    isOpened,
    isFocused,
    isFullscreen,
    title,
    defaultSize,
    defaultPosition,
    isFullscreenAllowed,
  };
};

export const WindowsRenderer = () => {
  const { windows, screenRef } = useWindowManager();
  return (
    <div className="relative flex size-full items-center justify-center">
      <AnimatePresence>
        {windows.map((window) => {
          return <Window key={window.id} {...window} screenRef={screenRef} />;
        })}
      </AnimatePresence>
    </div>
  );
};

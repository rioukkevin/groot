"use client";

import {
  createContext,
  FC,
  ReactNode,
  RefObject,
  useContext,
  useState,
} from "react";
import { WindowProps } from "../Window/Window";
import { v4 as uuidv4 } from "uuid";

interface WindowCreationProperties
  extends Omit<WindowProps, "id" | "isFocused" | "containerRef"> {
  isFullscreenAllowed?: boolean;
  id?: string;
}

interface WindowManagerProviderProps {
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement>;
}

interface WindowManagerContextType {
  windows: WindowProps[];
  openWindow: (window: WindowCreationProperties) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

export const WindowManagerProvider: FC<WindowManagerProviderProps> = ({
  children,
  containerRef,
}) => {
  const [windows, setWindows] = useState<WindowProps[]>([]);

  const openWindow = (window: WindowCreationProperties) => {
    setWindows((oldValue) => {
      if (!!window?.id && oldValue.find((w) => w.id === window.id)) {
        setTimeout(() => {
          focusWindow(window.id!);
        }, 100);
        return oldValue;
      }

      const id = window.id || uuidv4();

      setTimeout(() => {
        focusWindow(id);
      }, 100);

      return [
        ...oldValue,
        {
          ...window,
          id,
          containerRef,
          isFocused: true,
          isFullscreenAllowed: window.isFullscreenAllowed || false,
        },
      ];
    });
  };

  const closeWindow = (id: string) => {
    setWindows((oldValue) => {
      return oldValue.filter((window) => window.id !== id);
    });
  };

  const focusWindow = (id: string) => {
    setWindows((oldValue) => {
      return oldValue.map((window) => ({
        ...window,
        isFocused: window.id === id,
      }));
    });
  };

  return (
    <WindowManagerContext.Provider
      value={{ windows, openWindow, closeWindow, focusWindow }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within an WindowManagerProvider",
    );
  }
  return context;
}

export const useIsWindowFocused = (id: string) => {
  const { windows } = useWindowManager();
  return windows.find((window) => window.id === id)?.isFocused;
};

export const useWindow = (id: string) => {
  const { windows, focusWindow, closeWindow } = useWindowManager();
  return {
    window: windows.find((window) => window.id === id),
    focusWindow: () => focusWindow(id),
    closeWindow: () => closeWindow(id),
  };
};

export const useOpenWindow = () => {
  const { openWindow } = useWindowManager();
  return openWindow;
};

export const useWindowExists = (id: string): boolean => {
  const { windows } = useWindowManager();
  return !!windows.find((window) => window.id === id);
};

export const useWindowCountById = (id: string) => {
  const { windows } = useWindowManager();
  return windows.filter((window) => window.id.includes(id)).length;
};

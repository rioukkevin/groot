"use client";

import Image from "next/image";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
 ChangeEvent } from "react";

import IMGBackground from "@/assets/background.jpg";
import { useScopedI18n } from "@/lib/locales/client";
import { useUmami } from "@/lib/umami";

interface BackgroundContextType {
  currentBackground: string;
  setBackground: (background: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  currentBackground: IMGBackground.src,
  setBackground: () => {},
});

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
  defaultBackground?: string;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
  defaultBackground = IMGBackground.src,
}) => {
  const { track } = useUmami();

  const [currentBackground, setCurrentBackground] =
    useState<string>(defaultBackground);

  useEffect(() => {
    const storedBackground = localStorage.getItem("background");
    if (storedBackground) {
      setCurrentBackground(storedBackground);
    }
  }, []);

  const setBackground = (background: string) => {
    setCurrentBackground(background);
    localStorage.setItem("background", background);
    track?.("changeBackground", { background });
  };

  return (
    <BackgroundContext.Provider value={{ currentBackground, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const BackgroundFileSelector: React.FC = () => {
  const { currentBackground, setBackground } = useBackground();
  const t = useScopedI18n("theme");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > 4) {
        alert(t("background.fileTooLarge"));
        event.target.value = "";
        return;
      }
    }
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setBackground(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert(t("background.invalidImageFile"));
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {currentBackground && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            alt={t("background.currentBackgroundPreview")}
            className="object-cover"
            layout="fill"
            src={currentBackground}
          />
        </div>
      )}
      <div className="w-full">
        <label
          className="block w-full cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-center text-sm text-neutral-200"
          htmlFor="files"
        >
          {t("background.changeBackground")}
        </label>
        <input
          accept="image/*"
          className="hidden"
          id="files"
          type="file"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

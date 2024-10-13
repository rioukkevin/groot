import { BackgroundFileSelector } from "@/modules/Screen/Background";
import { WindowChildrenProps } from "@/modules/Window";
import { FC, useState } from "react";

enum Language {
  English = "en",
  French = "fr",
}

enum ColorPalette {
  Dark = "dark",
  Gray = "gray",
  Red = "red",
  Orange = "orange",
  Yellow = "yellow",
  Amber = "amber",
  Lime = "lime",
  Green = "green",
  Teal = "teal",
  Cyan = "cyan",
  Blue = "blue",
  Indigo = "indigo",
  Purple = "purple",
  Pink = "pink",
  Slate = "slate",
}

interface ColorButtonProps {
  color: ColorPalette;
  selectedColor: ColorPalette;
  onClick: (color: ColorPalette) => void;
}

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  selectedColor,
  onClick,
}) => {
  const bgColorClass = `bg-${color}-500`;
  const isSelected = color === selectedColor;

  return (
    <button
      className={`h-8 w-8 rounded-lg shadow-sm shadow-neutral-200/10 ${bgColorClass} ${isSelected ? "ring-2 ring-white" : ""}`}
      aria-label={color}
      onClick={() => onClick(color)}
    ></button>
  );
};

export const SettingsWindow: FC<WindowChildrenProps> = () => {
  const [language, setLanguage] = useState<Language>(Language.English);
  const [colorPalette, setColorPalette] = useState<ColorPalette>(
    ColorPalette.Dark,
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col justify-between gap-2">
          <label className="text-lg font-bold text-neutral-200">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="block w-full cursor-pointer rounded-lg border border-neutral-600/50 bg-neutral-700 p-2 text-sm text-neutral-200 focus:border-neutral-600"
          >
            <option value={Language.English}>English</option>
            <option value={Language.French}>French</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-neutral-200">Theme</label>
          <div className="flex flex-wrap justify-start gap-2">
            {Object.values(ColorPalette).map((color) => (
              <ColorButton
                key={color}
                color={color}
                selectedColor={colorPalette}
                onClick={setColorPalette}
              />
            ))}
          </div>
        </div>

        <BackgroundFileSelector />
      </div>
    </div>
  );
};

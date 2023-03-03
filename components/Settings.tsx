import React, { createContext, FC, PropsWithChildren, useState } from "react";

interface ISettings {
  isATech: boolean;
  setIsATech: (value: boolean) => void;
}

export const SettingsContext = createContext<ISettings>({
  isATech: false,
  setIsATech: () => null,
});

interface IProps extends PropsWithChildren {}

export const SettingsProvider: FC<IProps> = (props) => {
  const [isATech, setIsATech] = useState(false);

  return (
    <SettingsContext.Provider value={{ isATech, setIsATech }}>
      {props.children}
    </SettingsContext.Provider>
  );
};

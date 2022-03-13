import { createContext, FC, LegacyRef, useState } from "react";
import * as animations from "./animations";

type TTypes = keyof typeof animations | "animation";

export interface ITriggerParams {
  type: TTypes;
  ref?: LegacyRef<any>;
  callback?: () => void;
}

interface IStore {
  trigger: (props: ITriggerParams) => void;
  registerTrigger: (callback: (props: ITriggerParams) => void) => void;
}

export const DEFAULT_VALUE: IStore = {
  trigger: () => null,
  registerTrigger: () => null,
};

export const TransitionContext = createContext<IStore>(DEFAULT_VALUE);

export const TransitionProvider: FC<any> = (props) => {
  const [triggerList, setTriggerList] = useState<
    ((props: ITriggerParams) => void)[]
  >([]);

  const trigger = (props: ITriggerParams) => {
    triggerList.forEach((ex) => ex(props));
  };

  const registerTrigger = (callback: (...params: any) => void) => {
    setTriggerList((previousValue) => [...previousValue, callback]);
  };

  return (
    <TransitionContext.Provider
      value={{
        trigger,
        registerTrigger,
      }}
    >
      {props.children}
    </TransitionContext.Provider>
  );
};

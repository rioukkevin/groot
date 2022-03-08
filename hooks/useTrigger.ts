import { useMemo, useState } from "react";
import { MINIMAL_TIME_BEFORE_ANIMATION } from "../config/config";

interface ILoader {
  isLoading: boolean;
}

interface ILoaderTrigger extends ILoader {
  trigger: () => void;
}

export const useLoader = (): ILoader => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  setTimeout(() => setIsLoading(false), MINIMAL_TIME_BEFORE_ANIMATION);

  return {
    isLoading,
  };
};

export const useLoaderTrigger = (): ILoaderTrigger => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const initialTime = useMemo(() => new Date().getTime(), []);

  const trigger = () => {
    const actualTime = new Date().getTime();
    const timeElapsed = actualTime - initialTime;
    setTimeout(
      () => {
        setIsLoading(false);
      },
      timeElapsed < MINIMAL_TIME_BEFORE_ANIMATION
        ? MINIMAL_TIME_BEFORE_ANIMATION - timeElapsed
        : 1
    );
  };

  return {
    isLoading,
    trigger,
  };
};

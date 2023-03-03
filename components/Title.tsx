import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import useWindowPosition from "../hooks/useWindowScroll";

interface IProps {
  value: string;
}

export const Title: FC<IProps> = (props) => {
  const titleRef = useRef(null);
  const { y } = useWindowPosition();
  const { height } = useWindowSize();

  const [yPosition, setYPosition] = useState<number>(0);

  useEffect(() => {
    if (titleRef.current) {
      // @ts-ignore
      setYPosition(titleRef.current.getBoundingClientRect().top);
    }
  }, [y]);

  const movement = useMemo(() => {
    const position = (yPosition - (height / 3) * 2) / 5;
    if (position <= -100) {
      return -100;
    }
    if (position >= 50) {
      return 50;
    }
    if (position > -100 || position < 50) {
      return position;
    }
  }, [y]);

  return (
    <div className="relative my-20 flex h-[280px] w-full flex-col items-center justify-center">
      <div
        className="absolute top-0 z-0 h-[130px] w-1/3 bg-tertiary opacity-50"
        style={{ left: movement }}
      ></div>
      <h1
        ref={titleRef}
        className="z-10 w-full whitespace-nowrap text-center text-3xl font-bold uppercase desk:text-7xl"
      >
        {props.value}
      </h1>
      <div
        className="absolute bottom-0 z-20 h-[130px] w-1/3 bg-tertiary opacity-50"
        style={{ right: movement }}
      ></div>
    </div>
  );
};

import { useState, useEffect } from "react";

export interface IOption {
  throttle: number;
}

const getWindowPosition = () => ({
  x: typeof window !== "undefined" ? window.pageXOffset : 0,
  y: typeof window !== "undefined" ? window.pageYOffset : 0,
});

export default function useWindowPosition() {
  const [windowPosition, setWindowPosition] = useState(getWindowPosition());

  useEffect(() => {
    const handleScroll = () => {
      setTimeout(() => setWindowPosition(getWindowPosition()), 0);
    };

    typeof window !== "undefined" &&
      window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return typeof window !== "undefined" ? windowPosition : { x: 0, y: 0 };
}

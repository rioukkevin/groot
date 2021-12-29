import anime from "animejs";
import React from "react";

export const animation = {
  showSearch: (ref: React.RefObject<HTMLDivElement>) => {
    anime({
      targets: ref.current,
      top: 0,
      easing: "easeOutExpo",
      duration: 300,
    });
  },
  hideSearch: (ref: React.RefObject<HTMLDivElement>) => {
    anime({
      targets: ref.current,
      top: -100,
      easing: "easeInExpo",
      duration: 300,
    });
  },
};

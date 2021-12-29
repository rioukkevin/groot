import anime from "animejs";
import React from "react";

export const animation = {
  showSearch: (ref: React.RefObject<HTMLAnchorElement>) => {
    anime({
      targets: ref.current,
      translateY: "0",
      easing: "easeOutExpo",
      duration: 300,
    });
  },
  hideSearch: (ref: React.RefObject<HTMLAnchorElement>) => {
    anime({
      targets: ref.current,
      translateY: "-170px",
      easing: "easeInExpo",
      duration: 300,
    });
  },
};

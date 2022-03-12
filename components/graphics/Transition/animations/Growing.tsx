import anime, { AnimeParams } from "animejs";
import { FC, LegacyRef, useEffect, useRef } from "react";
import { IAnimatedProps } from "./type";

import styles from "./Growing.module.scss";

const OPTIONS: AnimeParams = {
  easing: "easeInOutQuad",
  duration: 500,
};

const PAGE_TRANSITION_DURATION = 200;

export const animation = (
  refs: LegacyRef<any>[],
  complete: () => void,
  callback: () => void
) => {
  const element = refs[0];
  const reference = refs[1] as LegacyRef<HTMLDivElement>;

  const timeline = anime.timeline({
    ...OPTIONS,
  });
  timeline.add({
    targets: element,
    // @ts-ignore
    left: reference.getBoundingClientRect().left,
    // @ts-ignore
    top: reference.getBoundingClientRect().top,
    duration: 1,
  });
  timeline.add({
    targets: element,
    width: "100vw",
    left: 0,
  });
  timeline.add({
    targets: element,
    height: "100vh",
    top: 0,
    complete: callback,
  });
  timeline.add({
    targets: element,
    height: 0,
    top: "100vh",
    delay: PAGE_TRANSITION_DURATION,
    complete,
  });
};

export const Growing: FC<IAnimatedProps> = (props) => {
  const { animate, reference, callback, onEnd } = props;

  const element = useRef(null);

  useEffect(() => {
    if (animate) {
      if (!reference || !callback) return;
      animation([element.current, reference], onEnd, callback);
    }
  }, [animate]);

  return <div ref={element} className={styles.element} />;
};

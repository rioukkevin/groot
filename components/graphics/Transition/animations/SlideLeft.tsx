import anime, { AnimeParams } from "animejs";
import { FC, LegacyRef, useEffect, useRef } from "react";
import { IAnimatedProps } from "./type";

import styles from "./SlideLeft.module.scss";

const DURATION = 500;

const OPTIONS: AnimeParams = {
  easing: "easeInOutQuad",
  duration: DURATION,
};

const PAGE_TRANSITION_DURATION = 200;

const animation = (
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
    left: 0,
    top: 0,
    width: 0,
    height: "100vh",
    duration: 1,
  });
  timeline.add({
    targets: element,
    width: "100vw",
    complete: callback,
  });
  timeline.add(
    {
      targets: reference,
      transform: "translateX(100vw)",
    },
    `-=${DURATION}`
  );
  timeline.add({
    targets: element,
    height: 0,
    delay: PAGE_TRANSITION_DURATION,
    complete,
  });
};

export const SlideLeft: FC<IAnimatedProps> = (props) => {
  const { animate, reference, callback, onEnd } = props;

  const element = useRef(null);

  useEffect(() => {
    if (animate) {
      if (!reference || !callback) return;
      animation([element.current, reference], onEnd, callback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  return <div ref={element} className={styles.element} />;
};

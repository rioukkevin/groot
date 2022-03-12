import { FC, useContext, useEffect, useState } from "react";

import styles from "./Transition.module.scss";

import * as animations from "./animations";
import { ITriggerParams, TransitionContext } from "./TransitionContext";

interface IProps {}

export const Transition: FC<IProps> = (props) => {
  const [params, setParams] = useState<ITriggerParams>({
    type: "animation",
  });
  const [animate, setAnimate] = useState<boolean>(false);

  const transitions = useContext(TransitionContext);

  const anim = (props: ITriggerParams) => {
    setParams(props);
    setAnimate(true);
  };

  useEffect(() => {
    transitions.registerTrigger(anim);
  }, []);

  if (params.type === "animation") return <></>;

  const Component = animations[params.type];

  return (
    <div className={styles.container}>
      <Component
        {...params}
        animate={animate}
        reference={params.ref}
        onEnd={() => setAnimate(false)}
      />
    </div>
  );
};

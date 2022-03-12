import { ITriggerParams } from "../TransitionContext";

export interface IAnimatedProps extends ITriggerParams {
  animate: boolean;
  reference?: ITriggerParams["ref"];
  onEnd: () => void;
}

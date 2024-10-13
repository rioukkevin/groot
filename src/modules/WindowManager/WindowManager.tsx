import { useWindowManager } from "./WindowManagerContext";
import { Window } from "../Window";
import { AnimatePresence } from "framer-motion";

export const WindowManager = () => {
  const { windows } = useWindowManager();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <AnimatePresence>
        {windows.map((window) => (
          <Window key={window.id} {...window}>
            {window.children}
          </Window>
        ))}
      </AnimatePresence>
    </div>
  );
};

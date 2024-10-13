"use cleint";

import { AnimatePresence, motion } from "framer-motion";
import { DockContainer, DockIcon, DockItem, DockLabel } from "./index";

export interface DockElement {
  title: string;
  icon: React.ReactNode;
  onPress: (item: DockElement) => void;
}

interface DockProps {
  items: DockElement[];
}

export function Dock({ items }: DockProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-2 z-50 flex w-full max-w-full justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", bounce: 0, delay: 1 }}
      >
        <DockContainer className="items-end pb-3">
          {items.map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-neutral-600/80 shadow-lg backdrop-blur-md"
              onClick={() => item.onPress(item)}
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </DockContainer>
      </motion.div>
    </AnimatePresence>
  );
}

"use cleint";

import { AnimatePresence, motion } from "framer-motion";
import { DockContainer, DockIcon, DockItem, DockLabel } from "./index";

export interface DockElement {
  id: string;
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
        className="pointer-events-none absolute bottom-2 z-30 flex w-full max-w-full justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", bounce: 0, delay: 1 }}
        whileHover={{ zIndex: 100, transition: { delay: 0 } }}
      >
        <DockContainer className="pointer-events-auto items-end pb-3">
          {items.map((item, idx) => (
            <DockItem
              key={idx}
              className="aspect-square rounded-full bg-neutral-600/80 shadow-lg backdrop-blur-md hover:shadow-white/10"
              onClick={() => item.onPress(item)}
              windowId={item.id}
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

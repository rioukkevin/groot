"use client";

import { motion } from "framer-motion";
import React, { Children } from "react";

interface WidgetsProps {
  children: React.ReactNode;
}

export const Widgets: React.FC<WidgetsProps> = ({ children }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      animate="visible"
      className="absolute right-4 top-4 flex flex-col space-y-4"
      initial="hidden"
      variants={containerVariants}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

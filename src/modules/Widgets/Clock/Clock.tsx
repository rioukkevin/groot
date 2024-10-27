"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const CLOCK_SIZE = 224;
const CLOCK_SECONDS_MAX_HEIGHT = CLOCK_SIZE * 0.1;
const CLOCK_SECONDS_MIN_HEIGHT = CLOCK_SIZE * 0.03;
const CLOCK_MINUTES_HEIGHT = (CLOCK_SIZE / 2) * 0.75;
const CLOCK_HOURS_HEIGHT = (CLOCK_SIZE / 2) * 0.55;

const CLOCK_SECONDS_RANGE = 16;

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const calculateIndicatorColor = (distance: number): string => {
    const maxDistance = CLOCK_SECONDS_RANGE;
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    const colorValue = Math.round(255 - normalizedDistance * 155);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
  };

  const calculateIndicatorHeight = (distance: number): string => {
    const maxDistance = CLOCK_SECONDS_RANGE;
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    const heightRange = CLOCK_SECONDS_MAX_HEIGHT - CLOCK_SECONDS_MIN_HEIGHT; // Max height - Min height
    const height = Math.round(
      CLOCK_SECONDS_MAX_HEIGHT - normalizedDistance * heightRange,
    );
    return height + "px";
  };

  const calculateIndicatorStyle = (
    position: number,
    currentNumber: number,
  ): { backgroundColor: string; height: string } => {
    const lowerBound = (currentNumber - CLOCK_SECONDS_RANGE + 60) % 60;
    const upperBound = currentNumber;

    const isInRange = (pos: number) => {
      if (lowerBound <= upperBound) {
        return pos >= lowerBound && pos <= upperBound;
      } else {
        return pos >= lowerBound || pos <= upperBound;
      }
    };

    if (isInRange(position)) {
      let distance: number;
      if (position <= upperBound) {
        distance = upperBound - position;
      } else {
        distance = 60 - position + upperBound;
      }

      return {
        backgroundColor: calculateIndicatorColor(distance),
        height: calculateIndicatorHeight(distance),
      };
    }

    return {
      backgroundColor: `rgb(100, 100, 100)`,
      height: CLOCK_SECONDS_MIN_HEIGHT + "px",
    };
  };

  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className="relative flex items-center justify-center rounded-2xl bg-neutral-800 shadow-lg"
      initial={{
        opacity: 0,
      }}
      style={{
        width: CLOCK_SIZE,
        height: CLOCK_SIZE,
      }}
      transition={{
        delay: 1,
      }}
    >
      <div
        className="rounded-full bg-neutral-700"
        style={{
          width: 0.88 * CLOCK_SIZE,
          height: 0.88 * CLOCK_SIZE,
        }}
      >
        {[...Array(60)].map((_, index) => (
          <motion.div
            key={index}
            animate={{
              opacity: 1,
              transform: `rotate(${index * 6}deg)`,
              ...calculateIndicatorStyle(index, time.getSeconds()),
            }}
            className="absolute left-1/2 top-0 rounded-b-lg bg-neutral-600"
            initial={{
              opacity: 0,
              transform: `rotate(0deg)`,
              height: CLOCK_SECONDS_MAX_HEIGHT,
            }}
            style={{
              transformOrigin: `center ${CLOCK_SIZE / 2}px`,
              width: 0.01 * CLOCK_SIZE,
              marginLeft: -0.005 * CLOCK_SIZE,
            }}
            transition={{
              duration: 1,
              ease: "linear",
            }}
          />
        ))}
        <motion.div
          animate={{
            transform: `rotate(${((time.getHours() % 12) + time.getMinutes() / 60) * 30}deg)`,
          }}
          className="absolute left-1/2 origin-bottom -translate-x-1/2 rounded-full bg-neutral-200"
          initial={{
            transform: `rotate(1080deg)`,
          }}
          style={{
            height: CLOCK_HOURS_HEIGHT,
            top: CLOCK_SIZE / 2 - CLOCK_HOURS_HEIGHT,
            width: 0.01 * CLOCK_SIZE,
            marginLeft: -0.005 * CLOCK_SIZE,
          }}
          transition={{
            type: "spring",
            bounce: 0,
          }}
        />
        <motion.div
          animate={{
            transform: `rotate(${(time.getMinutes() + time.getSeconds() / 60) * 6}deg)`,
          }}
          className="absolute left-1/2 origin-bottom -translate-x-1/2 rounded-full bg-neutral-200"
          initial={{
            transform: `rotate(1080deg)`,
          }}
          style={{
            height: CLOCK_MINUTES_HEIGHT,
            top: CLOCK_SIZE / 2 - CLOCK_MINUTES_HEIGHT,
            width: 0.01 * CLOCK_SIZE,
            marginLeft: -0.005 * CLOCK_SIZE,
          }}
          transition={{
            type: "spring",
            bounce: 0,
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-200" />
      </div>
    </motion.div>
  );
};

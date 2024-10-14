import { FC, useState, useEffect, useCallback } from "react";
import { WindowChildrenProps } from "@/modules/Window";
import { DrawSVG, LooserSVG, WinnerSVG } from "./TicTacToeSVG";
import { computerMove } from "./computer";
import { useCalculateWinner } from "./utils";
import { FishSymbol, PawPrint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScopedI18n } from "@/lib/locales/client";

export const TicTacToeWindow: FC<WindowChildrenProps> = () => {
  const t = useScopedI18n("tictactoe");
  type Board = Array<"X" | "O" | null>;

  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const result = useCalculateWinner(board);

  const play = useCallback(
    (index: number) => {
      if (board[index] || result.isGameFinished) return;

      const newBoard = board.slice();
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);

      setIsXNext(!isXNext);
    },
    [board, result.isGameFinished, isXNext],
  );

  useEffect(() => {
    if (!isXNext && !result.isGameFinished) {
      const timer = setTimeout(() => {
        const computerIndex = computerMove(board);
        play(computerIndex);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isXNext, result.isGameFinished, board, play]);

  useEffect(() => {
    if (result.isGameFinished) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [result.isGameFinished]);

  const handleReplay = () => {
    setShowResult(false);
    setTimeout(() => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
    }, 200);
  };

  return (
    <div className="relative flex w-full flex-col gap-4">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="board"
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {board.map((cell, index) => (
              <motion.button
                key={index}
                className="flex size-24 items-center justify-center rounded-lg bg-neutral-700 text-4xl font-bold transition-colors hover:bg-neutral-600"
                aria-label={`Cell ${index + 1}`}
                onClick={() => play(index)}
                disabled={!isXNext || result.isGameFinished}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {cell === "X" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <PawPrint size={48} />
                  </motion.div>
                ) : cell === "O" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <FishSymbol size={48} />
                  </motion.div>
                ) : null}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="inset-0 flex aspect-square w-full flex-col items-center justify-center fill-neutral-300"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -360 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 360 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              {result.winner === "X" ? (
                <WinnerSVG />
              ) : result.winner === "O" ? (
                <LooserSVG />
              ) : (
                <DrawSVG />
              )}
            </motion.div>
            <motion.button
              className="mt-4 rounded-lg bg-neutral-700 px-4 py-2 text-lg font-bold text-neutral-300 transition-colors hover:bg-neutral-600"
              onClick={handleReplay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {t("restart")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

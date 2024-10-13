import { useMemo } from "react";

export const calculateWinner = (board: Array<string | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        isGameFinished: true,
      };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return {
      winner: "Draw",
      isGameFinished: true,
    };
  }
  return {
    winner: null,
    isGameFinished: false,
  };
};

export const useCalculateWinner = (board: Array<string | null>) => {
  return useMemo(() => calculateWinner(board), [board]);
};

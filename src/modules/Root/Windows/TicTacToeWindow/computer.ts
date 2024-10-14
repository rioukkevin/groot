import { calculateWinner } from "./utils";

export const computerMove = (board: Array<string | null>): number => {
  // Random chance to make a wrong move
  if (Math.random() < 0.03) {
    const emptyIndices = board.reduce((acc, cell, index) => {
      if (cell === null) acc.push(index);
      return acc;
    }, [] as number[]);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Check for winning move
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = "O";
      if (calculateWinner(testBoard).isGameFinished) {
        return i;
      }
    }
  }

  // Block player's winning move
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      const testBoard = [...board];
      testBoard[i] = "X";
      if (calculateWinner(testBoard).isGameFinished) {
        return i;
      }
    }
  }

  // If no winning or blocking move, play randomly
  const emptyIndices = board.reduce((acc, cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, [] as number[]);

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

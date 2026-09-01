/**
 * Cursor movement for a wrapped grid of cards, shared by the contact wizard
 * and the standalone pickers so both behave identically.
 *
 * ←→ step one card and wrap. ↑↓ step a whole row; dropping into a short final
 * row lands on its last card rather than refusing to move, which would leave
 * that row unreachable from the keyboard.
 */
export function gridStep(
  current: number,
  count: number,
  perRow: number,
  key: string,
): number {
  if (count === 0) return 0;
  if (key === "ArrowLeft") return (current - 1 + count) % count;
  if (key === "ArrowRight") return (current + 1) % count;

  const lastRow = Math.floor((count - 1) / perRow);
  const row = Math.floor(current / perRow);
  if (key === "ArrowUp") return row === 0 ? current : current - perRow;
  if (key === "ArrowDown")
    return row === lastRow ? current : Math.min(count - 1, current + perRow);
  return current;
}

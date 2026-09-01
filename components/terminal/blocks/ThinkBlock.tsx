export function ThinkBlock({ text }: { text: string }) {
  return (
    <div
      className="mb-2 whitespace-pre-wrap italic"
      style={{ color: "var(--faint)" }}
    >
      {text}
    </div>
  );
}

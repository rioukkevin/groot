export function SayBlock({ full, n }: { full: string; n: number }) {
  const shown = full.slice(0, n);
  const caret = n < full.length ? "▏" : "";
  return (
    <div className="mb-[10px] flex gap-2">
      <span className="flex-none" style={{ color: "var(--accent)" }}>
        ⏺
      </span>
      <span className="min-w-0 whitespace-pre-wrap">
        {shown}
        <span style={{ color: "var(--accent)" }}>{caret}</span>
      </span>
    </div>
  );
}

export function EchoBlock({ text }: { text: string }) {
  return (
    <div
      className="mx-[-16px] mb-[10px] mt-[6px] flex gap-2 px-4 py-px"
      style={{ background: "var(--echo)" }}
    >
      <span className="flex-none" style={{ color: "var(--faint)" }}>
        ▌
      </span>
      <span className="whitespace-pre-wrap" style={{ color: "var(--fg)" }}>
        {text}
      </span>
    </div>
  );
}

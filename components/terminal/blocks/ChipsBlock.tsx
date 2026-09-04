/** A labelled row of chips per group — the same pill the contact wizard uses. */
export function ChipsBlock({
  groups,
  hl = [],
}: {
  groups: [string, string[], string?][];
  /** Chips an answer pointed at; drawn solid rather than tinted. */
  hl?: string[];
}) {
  const lit = new Set(hl);
  return (
    <div className="mb-3 pl-5">
      {groups.map(([label, items, tint]) => {
        const ink = tint ?? "var(--accent)";
        const fill = `color-mix(in oklab, ${ink} 18%, transparent)`;
        const solid = `color-mix(in oklab, ${ink} 85%, var(--bg))`;
        return (
        <div key={label} className="pb-2">
          <div className="whitespace-pre" style={{ color: ink }}>
            {label}
          </div>
          <div className="flex flex-wrap items-center gap-x-2">
            {items.map((item) => {
              const on = lit.has(item);
              const bg = on ? solid : fill;
              return (
                <div key={item} className="whitespace-pre">
                  <span style={{ color: bg }}>▐</span>
                  <span
                    style={{
                      background: bg,
                      color: on ? "var(--bg)" : "var(--fg)",
                      fontWeight: on ? 600 : undefined,
                    }}
                  >
                    {item}
                  </span>
                  <span style={{ color: bg }}>▌</span>
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
    </div>
  );
}

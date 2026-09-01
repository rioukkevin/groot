/** A labelled row of chips per group — the same pill the contact wizard uses. */
export function ChipsBlock({ groups }: { groups: [string, string[]][] }) {
  const fill = "color-mix(in oklab, var(--accent) 18%, transparent)";

  return (
    <div className="mb-3 pl-5">
      {groups.map(([label, items]) => (
        <div key={label} className="pb-2">
          <div className="whitespace-pre" style={{ color: "var(--faint)" }}>
            {label}
          </div>
          <div className="flex flex-wrap items-center gap-x-2">
            {items.map((item) => (
              <div key={item} className="whitespace-pre">
                <span style={{ color: fill }}>▐</span>
                <span style={{ background: fill, color: "var(--fg)" }}>
                  {item}
                </span>
                <span style={{ color: fill }}>▌</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

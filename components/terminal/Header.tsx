const LOGO = `▗▄▄▄▄▄▄▄▖
▐ ❯_    ▌
▝▀▀▀▀▀▀▀▘`;

export function Header() {
  return (
    <>
      <div className="mb-[10px] flex items-start gap-[14px]">
        <div
          className="flex-none whitespace-pre pt-px text-[13px] leading-[1.15]"
          style={{ color: "var(--accent)" }}
        >
          {LOGO}
        </div>
        <div className="min-w-0">
          <div>
            <span className="font-bold">kr</span>{" "}
            <span style={{ color: "var(--dim)" }}>v2.4.1</span>
          </div>
          <div style={{ color: "var(--dim)" }}>
            portfolio shell · Kevin Riou · fullstack web developer, freelance
          </div>
          <div style={{ color: "var(--dim)" }}>~/work/kevin-riou</div>
        </div>
      </div>
      <div
        className="mb-3 whitespace-pre-wrap"
        style={{ color: "var(--warn)" }}
      >
        ▲ Booked through October 2026{" "}
        <span style={{ color: "var(--dim)" }}>· run /now for what changed</span>
      </div>
    </>
  );
}

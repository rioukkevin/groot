interface StatusBarProps {
  usageLabel: string;
  ctxLabel: string;
  modeLabel: string;
  modeColor: string;
  onHelp: () => void;
}

export function StatusBar({
  usageLabel,
  ctxLabel,
  modeLabel,
  modeColor,
  onHelp,
}: StatusBarProps) {
  return (
    <div className="flex-none px-4 pb-2 pt-[5px]">
      <div className="flex items-baseline gap-3">
        <span style={{ color: "var(--dim)" }}>{usageLabel}</span>
        <span style={{ color: "var(--faint)" }}>{ctxLabel}</span>
        <span className="flex-1" />
        <button className="link-help" onClick={onHelp}>
          /help
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="flex-none" style={{ color: modeColor }}>
          ⏵⏵
        </span>
        <span style={{ color: modeColor }}>{modeLabel}</span>
        <span style={{ color: "var(--faint)" }}>
          (shift+tab to cycle) · ? for shortcuts
        </span>
      </div>
    </div>
  );
}

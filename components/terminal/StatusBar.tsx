interface StatusBarProps {
  usageLabel: string;
  ctxLabel: string;
  modeLabel: string;
  modeColor: string;
  modeHint: string;
  onHelp: () => void;
  onMode: () => void;
}

export function StatusBar({
  usageLabel,
  ctxLabel,
  modeLabel,
  modeColor,
  modeHint,
  onHelp,
  onMode,
}: StatusBarProps) {
  return (
    <div className="flex-none px-4 pb-2 pt-[5px]">
      <div className="flex items-baseline gap-3">
        <span className="hidden sm:inline" style={{ color: "var(--dim)" }}>{usageLabel}</span>
        <span className="truncate" style={{ color: "var(--faint)" }}>{ctxLabel}</span>
        <span className="flex-1" />
        <button className="link-help tap-y" onClick={onHelp}>
          /help
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <button className="tap-y flex items-baseline gap-2" onClick={onMode}>
          <span className="flex-none" style={{ color: modeColor }}>
            ⏵⏵
          </span>
          <span style={{ color: modeColor }}>{modeLabel}</span>
        </button>
        <span className="hidden truncate sm:inline" style={{ color: "var(--faint)" }}>{modeHint}</span>
      </div>
    </div>
  );
}

import type { ShellContent } from "@/lib/terminal/shell-content";

const FALLBACK = `↑↓ move selection   ↵ open selected row     → / space open too
↵ send (typing)     ⇥ complete command      ↑↓ history when typing
esc release list    shift+⇥ language        ? toggle this
/ commands          ctrl+l clear transcript  ctrl+c reset input`;

export function Shortcuts({ content }: { content: ShellContent }) {
  return (
    <div
      className="flex-none whitespace-pre border-t px-4 py-2"
      style={{ borderTopColor: "var(--hair)", color: "var(--dim)" }}
    >
      {content.s("shortcuts", FALLBACK)}
    </div>
  );
}

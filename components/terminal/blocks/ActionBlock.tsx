export function ActionBlock({
  actionLabel,
  act,
}: {
  actionLabel: string;
  act: () => void;
}) {
  return (
    <div className="mb-3 pl-5">
      <button className="link-action" onClick={act}>
        {actionLabel}
      </button>
    </div>
  );
}

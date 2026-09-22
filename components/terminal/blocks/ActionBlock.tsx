/** One line the visitor can act on: a file to download, or a callback. */
export function ActionBlock({
  actionLabel,
  href,
  act,
}: {
  actionLabel: string;
  href?: string;
  act?: () => void;
}) {
  return (
    <div className="mb-3 pl-5">
      {href ? (
        <a className="link-action" href={href} download>
          {actionLabel}
        </a>
      ) : (
        <button className="link-action" onClick={act}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

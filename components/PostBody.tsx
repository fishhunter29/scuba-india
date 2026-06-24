// Renders post body markdown-lite: blank-line-separated blocks, "## " headings,
// "- " bullet lists, and **bold** inline spans. No markdown dependency needed
// for the level of formatting these guides use.
function inline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyBase}-${i}`}>{part}</strong> : part,
  );
}

export default function PostBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('## ')) {
          return <h3 key={i}>{trimmed.slice(3)}</h3>;
        }
        const lines = trimmed.split('\n').map((l) => l.trim());
        if (lines.length > 0 && lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(trimmed, `${i}`)}</p>;
      })}
    </>
  );
}

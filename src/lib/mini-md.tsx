import React from "react";

/**
 * Tiny markdown-ish renderer for seed content: **bold**, *italic*, `code`,
 * paragraphs (blank line), and "- " bullet lists. No external dependency.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<React.Fragment key={`${keyPrefix}-t${i++}`}>{text.slice(lastIndex, match.index)}</React.Fragment>);
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={`${keyPrefix}-c${i++}`} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i${i++}`} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(<React.Fragment key={`${keyPrefix}-t${i++}`}>{text.slice(lastIndex)}</React.Fragment>);
  }
  return nodes;
}

export function MiniMd({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/);

  return (
    <div className={className}>
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n").filter((l) => l.trim().length > 0);
        const isList = lines.length > 0 && lines.every((l) => l.trim().startsWith("- "));

        if (isList) {
          return (
            <ul key={pi} className="my-3 space-y-1.5 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2.5 text-[15px] leading-relaxed">
                  <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>{renderInline(line.trim().slice(2), `${pi}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={pi} className="my-3 text-[15px] leading-relaxed first:mt-0 last:mb-0">
            {lines.map((line, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(line, `${pi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

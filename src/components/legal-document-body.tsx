import {
  parseLegalMarkdown,
  splitLegalInline,
  type LegalBlock,
} from "@/lib/legal-markdown";

function LegalInline({ text }: { text: string }) {
  const parts = splitLegalInline(text);
  return (
    <>
      {parts.map((part, index) => {
        if (part.kind === "bold") {
          return (
            <strong key={index} className="font-medium text-charcoal">
              {part.value}
            </strong>
          );
        }
        if (part.kind === "link") {
          return (
            <a
              key={index}
              href={part.href}
              className="break-all text-forest underline underline-offset-2 hover:text-forest-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part.label}
            </a>
          );
        }
        return <span key={index}>{part.value}</span>;
      })}
    </>
  );
}

function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className="scroll-mt-28 font-display text-[1.45rem] leading-[1.15] tracking-tight text-charcoal md:text-[1.6rem]"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          id={block.id}
          className="scroll-mt-28 font-display text-[1.15rem] leading-snug tracking-tight text-charcoal md:text-[1.25rem]"
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p>
          <LegalInline text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={`${index}-${item}`}>
              <LegalInline text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item, index) => (
            <li key={`${index}-${item}`}>
              <LegalInline text={item} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-sm border border-charcoal/10">
          <table className="min-w-full border-collapse text-left text-[0.8125rem] leading-relaxed text-charcoal">
            <thead className="bg-cream-dark/60">
              <tr>
                {block.headers.map((header, index) => (
                  <th
                    key={`${index}-${header}`}
                    className="border-b border-charcoal/10 px-3 py-2.5 font-medium align-top"
                  >
                    <LegalInline text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-charcoal/8 last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className="px-3 py-2.5 align-top text-charcoal/85"
                    >
                      <LegalInline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr className="my-8 border-charcoal/10" />;
    default:
      return null;
  }
}

export function LegalDocumentBody({ body }: { body: string }) {
  const blocks = parseLegalMarkdown(body);
  return (
    <div className="prose-credible mt-8 space-y-4">
      {blocks.map((block, index) => (
        <LegalBlockView key={index} block={block} />
      ))}
    </div>
  );
}

import { Code2 } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { highlightCodeQueryOptions } from "~/lib/code-highlight";

interface CodeBlockProps {
  filename: string;
  code: string;
  lang?: string;
}

export function CodeBlock({ filename, code, lang = "html" }: CodeBlockProps) {
  return (
    <div className="bg-card border-2 border-foreground shadow-[var(--shadow-brutal)]">
      <div className="bg-muted/60 flex items-center gap-2 border-b-2 border-foreground px-4 py-3">
        <Code2 className="text-muted-foreground h-3.5 w-3.5" />
        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
          {filename}
        </span>
      </div>
      <Suspense
        fallback={
          <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
            <code>{code}</code>
          </pre>
        }
      >
        <HighlightedCode code={code} lang={lang} />
      </Suspense>
    </div>
  );
}

function HighlightedCode({ code, lang }: { code: string; lang: string }) {
  const { data: html } = useSuspenseQuery(highlightCodeQueryOptions(code, lang));

  return (
    <div
      className="overflow-hidden text-sm leading-relaxed [&_pre]:overflow-x-auto [&_pre]:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

import { useSuspenseQuery } from "@tanstack/react-query";
import { Code2 } from "lucide-react";
import { Suspense } from "react";
import { highlightCodeQueryOptions } from "~/lib/code-highlight";

interface CodeBlockProps {
  filename: string;
  code: string;
  lang?: string;
}

export function CodeBlock({ filename, code, lang = "html" }: CodeBlockProps) {
  return (
    <div className="bg-secondary border-foreground min-w-0 overflow-hidden border-2 shadow-[var(--shadow-brutal)]">
      <div className="bg-muted/60 border-foreground flex items-center gap-2 border-b-2 px-4 py-3">
        <Code2 className="text-muted-foreground h-3.5 w-3.5" />
        <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
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
      className="w-full min-w-0 overflow-hidden text-sm leading-relaxed [&_.shiki]:max-w-full [&_.shiki]:overflow-x-auto [&_.shiki]:p-5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

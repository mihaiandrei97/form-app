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
    <div className="bg-card rounded-2xl border p-1">
      <div className="bg-muted/60 flex items-center gap-2 rounded-t-xl px-4 py-3">
        <div className="bg-destructive/40 h-3 w-3 rounded-full" />
        <div className="bg-chart-4/40 h-3 w-3 rounded-full" />
        <div className="bg-chart-5/40 h-3 w-3 rounded-full" />
        <span className="text-muted-foreground ml-2 text-xs">{filename}</span>
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
      className="overflow-hidden rounded-b-xl text-sm leading-relaxed [&_pre]:overflow-x-auto [&_pre]:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { codeToHtml } from "shiki";

// ---------------------------------------------------------------------------
// Shared highlight helper — all highlights use catppuccin dual-theme
// ---------------------------------------------------------------------------

const cache = new Map<string, string>();

async function highlight(code: string, lang = "html"): Promise<string> {
  const key = `${lang}:${code}`;
  if (cache.has(key)) return cache.get(key)!;

  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-macchiato",
    },
  });

  cache.set(key, html);
  return html;
}

// ---------------------------------------------------------------------------
// Landing page — static snippet, exposed via its own query key
// ---------------------------------------------------------------------------

const landingSnippet = `<form
  action="https://bforms.dev/api/f/abc123"
  method="POST"
>
  <input
    type="email"
    name="email"
    placeholder="you@example.com"
    required
  />

  <textarea
    name="message"
    placeholder="Your message..."
    required
  ></textarea>

  <button type="submit">
    Send Message
  </button>
</form>`;

export const $getHighlightedCode = createServerFn({
  method: "GET",
}).handler(async () => {
  return highlight(landingSnippet);
});

export const highlightedCodeQueryOptions = () =>
  queryOptions({
    queryKey: ["highlighted-code"],
    queryFn: () => $getHighlightedCode(),
    staleTime: Infinity,
  });

// ---------------------------------------------------------------------------
// Generic highlight — used by docs CodeBlock component
// ---------------------------------------------------------------------------

export const $highlightCode = createServerFn({ method: "GET" })
  .inputValidator((data: { code: string; lang?: string }) => data)
  .handler(async ({ data }) => {
    return highlight(data.code, data.lang ?? "html");
  });

export const highlightCodeQueryOptions = (code: string, lang = "html") =>
  queryOptions({
    queryKey: ["highlight", lang, code],
    queryFn: () => $highlightCode({ data: { code, lang } }),
    staleTime: Infinity,
  });

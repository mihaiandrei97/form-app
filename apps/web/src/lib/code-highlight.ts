import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { codeToHtml } from "shiki";

const htmlSnippet = `<form
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

let cachedHtml: string | null = null;

async function highlightCode(): Promise<string> {
  if (cachedHtml) return cachedHtml;

  cachedHtml = await codeToHtml(htmlSnippet, {
    lang: "html",
    themes: {
      light: "catppuccin-latte",
      dark: "catppuccin-macchiato",
    },
  });

  return cachedHtml;
}

export const $getHighlightedCode = createServerFn({
  method: "GET",
}).handler(async () => {
  return highlightCode();
});

export const highlightedCodeQueryOptions = () =>
  queryOptions({
    queryKey: ["highlighted-code"],
    queryFn: () => $getHighlightedCode(),
    staleTime: Infinity,
  });

import { useSuspenseQuery } from "@tanstack/react-query";
import { Code2, Copy, Globe, Terminal } from "lucide-react";
import { Suspense } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { highlightCodeQueryOptions } from "~/lib/code-highlight";
import type { FormField } from "~/lib/forms/field-types";

interface CodeSnippetsProps {
  endpointUrl: string;
  honeypotField?: string | null;
  fields?: FormField[] | null;
}

const snippetMeta = {
  html: {
    label: "HTML",
    title: "Drop-in form markup",
    description: "Paste this into any page and submit directly to your endpoint.",
    icon: Globe,
    badge: "No JavaScript",
  },
  javascript: {
    label: "JavaScript",
    title: "Send with fetch()",
    description: "Useful when you want custom UI states or async form handling.",
    icon: Code2,
    badge: "JSON payload",
  },
  curl: {
    label: "cURL",
    title: "Test from the terminal",
    description: "Quickly verify submissions locally before wiring up your frontend.",
    icon: Terminal,
    badge: "CLI",
  },
} as const;

function generateHtmlField(field: FormField): string {
  const requiredAttr = field.required ? " required" : "";
  const placeholderAttr = field.placeholder ? ` placeholder="${field.placeholder}"` : "";

  switch (field.type) {
    case "email":
      return `  <label for="${field.name}">${field.label}</label>
  <input type="email" id="${field.name}" name="${field.name}"${placeholderAttr}${requiredAttr} />`;

    case "textarea":
      return `  <label for="${field.name}">${field.label}</label>
  <textarea id="${field.name}" name="${field.name}"${placeholderAttr}${requiredAttr}></textarea>`;

    case "select":
      const options = field.options
        ?.map((opt) => `    <option value="${opt.value}">${opt.label}</option>`)
        .join("\n");
      return `  <label for="${field.name}">${field.label}</label>
  <select id="${field.name}" name="${field.name}"${requiredAttr}>
    <option value="">Select...</option>
${options}
  </select>`;

    case "checkbox":
      return `  <label>
    <input type="checkbox" name="${field.name}"${requiredAttr} />
    ${field.label}
  </label>`;

    case "text":
    default:
      return `  <label for="${field.name}">${field.label}</label>
  <input type="text" id="${field.name}" name="${field.name}"${placeholderAttr}${requiredAttr} />`;
  }
}

function generateJsFieldValue(field: FormField): string {
  switch (field.type) {
    case "email":
      return '"user@example.com"';
    case "textarea":
      return '"Your message here..."';
    case "select":
      return field.options?.[0]?.value ? `"${field.options[0].value}"` : '"option1"';
    case "checkbox":
      return "true";
    case "text":
    default:
      return `"Example ${field.label.toLowerCase()}"`;
  }
}

function SnippetPanel({
  lang,
  endpointUrl,
  onCopy,
  snippet,
  snippetKey,
}: {
  lang: "html" | "javascript" | "bash";
  endpointUrl: string;
  onCopy: (text: string, label: string) => void;
  snippet: string;
  snippetKey: keyof typeof snippetMeta;
}) {
  const meta = snippetMeta[snippetKey];
  const Icon = meta.icon;

  return (
    <div className="overflow-hidden border border-foreground/15 bg-card shadow-[var(--shadow-brutal)]">
      <div className="bg-muted flex flex-col gap-4 border-b-2 border-foreground px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-card text-card-foreground flex h-10 w-10 items-center justify-center border-2 border-foreground shadow-[var(--shadow-brutal)]">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">{meta.title}</p>
              <p className="text-sm text-muted-foreground">{meta.description}</p>
            </div>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className="bg-card text-card-foreground h-auto border-2 border-foreground px-3 py-1"
            >
              {meta.badge}
            </Badge>
            <span className="bg-card text-card-foreground border-2 border-foreground px-2 py-1 font-mono text-[11px] shadow-[2px_2px_0_0_var(--foreground)]">
              {endpointUrl}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => onCopy(snippet, `${meta.label} snippet`)}
        >
          <Copy className="h-4 w-4" />
          Copy {meta.label}
        </Button>
      </div>

      <div className="border-t-0 bg-foreground">
        <div className="flex items-center justify-between border-2 border-b-0 border-card bg-[#23252b] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 border border-card bg-[#ff5f57]" />
            <span className="h-3 w-3 border border-card bg-[#febc2e]" />
            <span className="h-3 w-3 border border-card bg-[#28c840]" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
            {meta.label}
          </span>
        </div>
        <Suspense
          fallback={
            <pre className="overflow-x-auto border-2 border-card bg-[#15171c] p-5 text-xs leading-6 text-slate-100">
              <code>{snippet}</code>
            </pre>
          }
        >
          <HighlightedSnippet code={snippet} lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}

function HighlightedSnippet({
  code,
  lang,
}: {
  code: string;
  lang: "html" | "javascript" | "bash";
}) {
  const { data: html } = useSuspenseQuery(highlightCodeQueryOptions(code, lang));

  return (
    <div
      className="w-full min-w-0 overflow-hidden border-2 border-card text-xs leading-6 [&_.shiki]:max-w-full [&_.shiki]:overflow-x-auto [&_.shiki]:p-5 [&_.shiki]:text-xs [&_.shiki]:leading-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function CodeSnippets({ endpointUrl, honeypotField, fields }: CodeSnippetsProps) {
  const sortedFields = fields?.slice().sort((a, b) => a.order - b.order) ?? [];
  const hasFields = sortedFields.length > 0;

  const htmlFields = hasFields
    ? sortedFields.map((field) => generateHtmlField(field)).join("\n\n")
    : `  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>`;

  const honeypotHtml = honeypotField
    ? `
  <!-- Honeypot field - do not remove -->
  <input type="text" name="${honeypotField}" style="display:none" tabindex="-1" autocomplete="off" />
`
    : "";

  const htmlSnippet = `<form action="${endpointUrl}" method="POST">
${htmlFields}
${honeypotHtml}
  <button type="submit">Send</button>
</form>`;

  const jsFormData = hasFields
    ? sortedFields
        .map((field) => `  ${field.name}: ${generateJsFieldValue(field)}`)
        .join(",\n")
    : `  email: "user@example.com",
  message: "Hello from my website!"`;

  const jsSnippet = `// Using fetch API
const formData = {
${jsFormData}
};

fetch("${endpointUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
})
  .then(response => response.json())
  .then(data => console.log("Success:", data))
  .catch(error => console.error("Error:", error));`;

  const curlData = hasFields
    ? sortedFields
        .map((field) => {
          const value = generateJsFieldValue(field).replace(/^"|"$/g, "");
          return `"${field.name}":"${value}"`;
        })
        .join(",")
    : '"email":"user@example.com","message":"Hello!"';

  const curlSnippet = `curl -X POST ${endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{${curlData}}'`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Tabs defaultValue="html" className="gap-5">
      <div className="flex flex-col gap-3 border-2 border-foreground bg-card p-4 shadow-[var(--shadow-brutal)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Quickstart snippets
            </p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Pick the integration style that matches your stack, then copy and adapt
              the example fields as needed.
            </p>
          </div>
          <Badge variant="secondary" className="h-auto px-3 py-1 text-[11px]">
            {sortedFields.length} field{sortedFields.length === 1 ? "" : "s"}
          </Badge>
        </div>

        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger
            value="html"
            className="data-active:bg-primary data-active:text-primary-foreground data-active:border-foreground h-auto flex-none border-2 border-foreground bg-background px-4 py-2 font-bold"
          >
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="javascript"
            className="data-active:bg-primary data-active:text-primary-foreground data-active:border-foreground h-auto flex-none border-2 border-foreground bg-background px-4 py-2 font-bold"
          >
            JavaScript
          </TabsTrigger>
          <TabsTrigger
            value="curl"
            className="data-active:bg-primary data-active:text-primary-foreground data-active:border-foreground h-auto flex-none border-2 border-foreground bg-background px-4 py-2 font-bold"
          >
            cURL
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="html" className="mt-0">
        <SnippetPanel
          lang="html"
          endpointUrl={endpointUrl}
          onCopy={copyToClipboard}
          snippet={htmlSnippet}
          snippetKey="html"
        />
      </TabsContent>

      <TabsContent value="javascript" className="mt-0">
        <SnippetPanel
          lang="javascript"
          endpointUrl={endpointUrl}
          onCopy={copyToClipboard}
          snippet={jsSnippet}
          snippetKey="javascript"
        />
      </TabsContent>

      <TabsContent value="curl" className="mt-0">
        <SnippetPanel
          lang="bash"
          endpointUrl={endpointUrl}
          onCopy={copyToClipboard}
          snippet={curlSnippet}
          snippetKey="curl"
        />
      </TabsContent>
    </Tabs>
  );
}

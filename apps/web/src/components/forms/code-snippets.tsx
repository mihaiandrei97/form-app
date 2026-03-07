import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { FormField } from "~/lib/forms/field-types";

interface CodeSnippetsProps {
  endpointUrl: string;
  honeypotField?: string | null;
  fields?: FormField[] | null;
}

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

export function CodeSnippets({ endpointUrl, honeypotField, fields }: CodeSnippetsProps) {
  const sortedFields = fields?.slice().sort((a, b) => a.order - b.order) ?? [];
  const hasFields = sortedFields.length > 0;

  // Generate HTML snippet
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

  // Generate JS snippet
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

  // Generate cURL snippet
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
    <Tabs defaultValue="html">
      <TabsList>
        <TabsTrigger value="html">HTML</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
        <TabsTrigger value="curl">cURL</TabsTrigger>
      </TabsList>

      <TabsContent value="html" className="mt-4">
        <div className="relative">
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
            <code>{htmlSnippet}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(htmlSnippet, "HTML snippet")}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy HTML</span>
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="javascript" className="mt-4">
        <div className="relative">
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
            <code>{jsSnippet}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(jsSnippet, "JavaScript snippet")}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy JavaScript</span>
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="curl" className="mt-4">
        <div className="relative">
          <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs">
            <code>{curlSnippet}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(curlSnippet, "cURL command")}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy cURL</span>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

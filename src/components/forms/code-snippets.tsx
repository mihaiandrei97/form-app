import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface CodeSnippetsProps {
  endpointUrl: string;
  honeypotField?: string | null;
}

export function CodeSnippets({ endpointUrl, honeypotField }: CodeSnippetsProps) {
  const htmlSnippet = `<form action="${endpointUrl}" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>
${
  honeypotField
    ? `
  <!-- Honeypot field - do not remove -->
  <input type="text" name="${honeypotField}" style="display:none" tabindex="-1" autocomplete="off" />
`
    : ""
}
  <button type="submit">Send</button>
</form>`;

  const jsSnippet = `// Using fetch API
const formData = {
  email: "user@example.com",
  message: "Hello from my website!"
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

  const curlSnippet = `curl -X POST ${endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","message":"Hello!"}'`;

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

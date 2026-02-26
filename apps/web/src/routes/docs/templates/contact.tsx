import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CodeBlock } from "~/components/docs/code-block";

export const Route = createFileRoute("/docs/templates/contact")({
  head: () => ({
    meta: [
      {
        title: "Contact Form Tutorial | BForms Docs",
      },
      {
        name: "description",
        content:
          "Step-by-step guide to creating a contact form with BForms. Set up fields, spam protection, email notifications, and embed the form on your site.",
      },
    ],
  }),
  component: ContactTemplatePage,
});

function ContactTemplatePage() {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="/" className="text-xl font-bold">
            BForms
          </a>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              render={<Link to="/pricing" />}
            >
              Pricing
            </Button>
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              render={<Link to="/docs" />}
            >
              Docs
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          nativeButton={false}
          render={<Link to="/docs/templates" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>

        {/* Hero */}
        <div className="space-y-4">
          <Badge variant="secondary">Template Tutorial</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Build a contact form from scratch
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            This tutorial walks you through creating a contact form endpoint in BForms,
            configuring the right fields, adding spam protection, and embedding the final
            HTML on your website. By the end you will have a working form that sends
            submissions straight to your dashboard and optionally to your email inbox.
          </p>
        </div>

        {/* What you will build */}
        <div className="bg-muted/40 mt-10 rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">What you will build</h2>
          <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
            <li>
              A form with three fields: <strong>name</strong>, <strong>email</strong>, and{" "}
              <strong>message</strong>.
            </li>
            <li>
              Honeypot-based spam protection that silently discards bot submissions.
            </li>
            <li>Domain restrictions so only your website can submit to the endpoint.</li>
            <li>An optional redirect to a custom thank-you page after submission.</li>
          </ul>
        </div>

        <Separator className="my-12" />

        {/* Step 1 */}
        <section className="space-y-6">
          <StepHeading number={1} title="Create a new form in the dashboard" />
          <p className="text-muted-foreground leading-relaxed">
            Log in to your BForms dashboard and click <strong>New Form</strong>. You will
            land on the form creation page with two tabs: <strong>Settings</strong> and{" "}
            <strong>Fields</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Start on the <strong>Settings</strong> tab. Enter a descriptive name for your
            form. Something like{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">Contact Form</code>{" "}
            or{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              Website Contact
            </code>{" "}
            works well. This name is only visible in your dashboard &mdash; visitors never
            see it.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 2 */}
        <section className="space-y-6">
          <StepHeading number={2} title="Set the redirect URL" />
          <p className="text-muted-foreground leading-relaxed">
            Still on the Settings tab, find the <strong>Redirect URL</strong> field. This
            is where visitors are sent after they submit the form. Enter the full URL of
            your thank-you page, for example:
          </p>
          <CodeBlock filename="example" code="https://yoursite.com/thank-you" />
          <p className="text-muted-foreground leading-relaxed">
            If you leave this empty, BForms will show a default success message. A custom
            thank-you page gives you full control over the post-submission experience
            &mdash; you can add next steps, links to your social accounts, or a
            confirmation message.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 3 */}
        <section className="space-y-6">
          <StepHeading number={3} title="Add your form fields" />
          <p className="text-muted-foreground leading-relaxed">
            Switch to the <strong>Fields</strong> tab. Use the field builder to add the
            three fields your contact form needs. For each field you can set the name,
            label, type, placeholder text, and whether the field is required.
          </p>

          <div className="space-y-4">
            <FieldCard
              name="name"
              type="Text"
              label="Name"
              placeholder="Your name"
              required
              description="A plain text field for the visitor's name."
            />
            <FieldCard
              name="email"
              type="Email"
              label="Email"
              placeholder="you@example.com"
              required
              description="Uses the email input type so browsers validate the format automatically."
            />
            <FieldCard
              name="message"
              type="Textarea"
              label="Message"
              placeholder="How can we help?"
              required
              description="A larger text area so visitors can write longer messages."
            />
          </div>

          <p className="text-muted-foreground leading-relaxed">
            You can always add more fields later (such as{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">subject</code> or{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">phone</code>) without
            breaking existing integrations. BForms will accept any field included in the
            submission and display it in the dashboard.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 4 */}
        <section className="space-y-6">
          <StepHeading number={4} title="Enable spam protection" />
          <div className="flex items-start gap-3">
            <Shield className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              Back on the <strong>Settings</strong> tab, enter a name for the{" "}
              <strong>Honeypot Field</strong>. A honeypot is a hidden field that real
              visitors never see or fill out, but automated bots typically do. When BForms
              receives a submission where the honeypot field has a value, it silently
              discards it.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Use a name that looks like a real field so bots are more likely to fill it in.
            The default suggestion is{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">_honeypot</code>, but
            you could also use something like{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">_hp_field</code> or{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">website_url</code>.
          </p>
          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">How it works in practice</p>
            <ol className="text-muted-foreground mt-2 list-inside list-decimal space-y-1 text-sm">
              <li>You add a hidden input to your HTML (shown in Step 6 below).</li>
              <li>Bots auto-fill every field, including the hidden one.</li>
              <li>
                BForms checks the honeypot field on the server. If it has a value, the
                submission is discarded.
              </li>
              <li>
                Real visitors never interact with the hidden field, so their submissions
                go through normally.
              </li>
            </ol>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 5 */}
        <section className="space-y-6">
          <StepHeading number={5} title="Restrict allowed domains" />
          <div className="flex items-start gap-3">
            <Globe className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              In the <strong>Allowed Domains</strong> field, enter the domains that are
              permitted to submit to your form. Separate multiple domains with commas or
              newlines. For example:
            </p>
          </div>
          <CodeBlock filename="allowed domains" code="yoursite.com, www.yoursite.com" />
          <p className="text-muted-foreground leading-relaxed">
            When this is set, BForms will reject submissions that originate from any other
            domain. This prevents someone from copying your form snippet and posting
            submissions from their own site. Leave the field empty if you want to accept
            submissions from anywhere (useful during development).
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 6 */}
        <section className="space-y-6">
          <StepHeading number={6} title="Embed the form on your website" />
          <p className="text-muted-foreground leading-relaxed">
            Click <strong>Create Form</strong>. BForms will generate a unique endpoint URL
            for your form. You can find the URL and ready-made code snippets on the form
            detail page in your dashboard.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Copy the HTML snippet below and paste it into your page. Replace{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">your-form-slug</code>{" "}
            with the actual slug from your dashboard.
          </p>

          <CodeBlock
            filename="contact.html"
            code={`<form action="https://bforms.dev/api/f/your-form-slug" method="POST">
  <label for="name">Name</label>
  <input type="text" id="name" name="name" placeholder="Your name" required />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" placeholder="How can we help?" required></textarea>

  <!-- Honeypot field - do not remove -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send Message</button>
</form>`}
          />

          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">About the honeypot input</p>
            <p className="text-muted-foreground mt-1 text-sm">
              The hidden input near the bottom is the honeypot field. It uses{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                style=&quot;display:none&quot;
              </code>{" "}
              so real visitors never see it,{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                tabindex=&quot;-1&quot;
              </code>{" "}
              so keyboard users cannot tab into it, and{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                autocomplete=&quot;off&quot;
              </code>{" "}
              so browsers do not autofill it. Make sure the{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">name</code> attribute
              matches the honeypot field name you entered in the dashboard.
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 7 */}
        <section className="space-y-6">
          <StepHeading number={7} title="Enable email notifications (optional)" />
          <div className="flex items-start gap-3">
            <Mail className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              If you want to receive an email every time someone submits the form, open
              the form in your dashboard and configure a notification channel. Enter the
              email address where you want notifications delivered. You can add multiple
              addresses if the form is handled by a team.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Even without email notifications, every submission is stored in your BForms
            dashboard and can be reviewed at any time.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 8 */}
        <section className="space-y-6">
          <StepHeading number={8} title="Test your form" />
          <p className="text-muted-foreground leading-relaxed">
            Before going live, submit a test entry from your website. Check the following:
          </p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              The submission appears in your BForms dashboard with the correct field
              values.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              You are redirected to your thank-you page (if you configured one).
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              You receive an email notification (if you enabled one).
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Submitting from a domain not in your allowed list is rejected.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            To test spam protection, temporarily make the honeypot field visible, fill it
            in, and submit. The submission should not appear in your dashboard.
          </p>
        </section>

        <Separator className="my-12" />

        {/* Tips */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium">
            <Sparkles className="text-primary h-4 w-4" />
            Tips and next steps
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TipCard
              title="Style the form"
              description="The HTML snippet has no styles on purpose. Add your own CSS or use a framework like Tailwind to match your brand."
            />
            <TipCard
              title="Add more fields later"
              description="You can add fields like subject or phone number at any time. Update the HTML to include the new inputs and BForms will capture them automatically."
            />
            <TipCard
              title="Use JavaScript for async submissions"
              description="Instead of a traditional form post, use the fetch API to submit without a page reload. Your dashboard provides a ready-made JavaScript snippet."
            />
            <TipCard
              title="Monitor your inbox"
              description="Check your BForms dashboard regularly. You can sort and filter submissions by date, and export them if needed."
            />
          </div>
        </section>

        <Separator className="my-12" />

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to="/docs/templates" />}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All templates
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to="/docs/templates/waiting-list" />}
          >
            Waiting list tutorial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} BForms. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/pricing"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Pricing
            </a>
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary/10 text-primary inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
        {number}
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function FieldCard({
  name,
  type,
  label,
  placeholder,
  required,
  description,
}: {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  description: string;
}) {
  return (
    <div className="bg-muted/40 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <code className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold">
          {type}
        </code>
        <span className="text-sm font-semibold">{label}</span>
        {required && (
          <Badge variant="secondary" className="text-xs">
            Required
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span>
          name: <code className="bg-muted rounded px-1 py-0.5">{name}</code>
        </span>
        <span>
          placeholder: <code className="bg-muted rounded px-1 py-0.5">{placeholder}</code>
        </span>
      </div>
    </div>
  );
}

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-muted/40 rounded-xl border p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}

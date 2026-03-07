import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  CheckCircle2,
  MessageSquare,
  Newspaper,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SiteHeader } from "~/components/site-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CodeBlock } from "~/components/docs/code-block";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Docs | BForms" },
      {
        name: "description",
        content:
          "Learn how to create form endpoints, protect them from spam, and embed them on your website with BForms.",
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          nativeButton={false}
          render={<a href="/" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="space-y-4">
          <Badge variant="secondary">Getting Started</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            BForms Documentation
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Learn how to set up a form endpoint, protect your inbox from spam, and use
            templates for faster form launches.
          </p>
        </div>

        <Separator className="my-10" />

        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">1) Set up a form endpoint</h2>
              <p className="text-muted-foreground">
                Every form starts with an endpoint. Create one in the dashboard, then
                point your HTML form to that URL.
              </p>
            </div>

            <div className="space-y-3">
              <StepItem number={1} text="Open your dashboard and choose New Form." />
              <StepItem number={2} text="Name your form and add the fields you expect." />
              <StepItem number={3} text="Copy the endpoint URL provided." />
              <StepItem number={4} text="Paste it into your form's action attribute." />
              <StepItem
                number={5}
                text="Submit a test entry and confirm it appears in the inbox."
              />
            </div>
          </div>

          <CodeBlock
            filename="contact.html"
            code={`<form action="https://bforms.dev/api/f/your-slug" method="POST">
  <input type="email" name="email" placeholder="you@example.com" required />
  <textarea name="message" placeholder="Your message..." required></textarea>
  <button type="submit">Send Message</button>
</form>`}
          />
        </section>

        <Separator className="my-12" />

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <Shield className="text-primary h-4 w-4" />
              Spam protection
            </div>
            <h2 className="text-2xl font-semibold">What is spam protection?</h2>
            <p className="text-muted-foreground">
              BForms uses honeypot fields to catch automated bot submissions. A honeypot
              is a hidden field that humans never fill out, but bots often do. When that
              field has a value, the submission is silently discarded.
            </p>
          </div>

          <div className="bg-muted/40 rounded-2xl border p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary h-5 w-5" />
              <h3 className="text-lg font-semibold">Best practices</h3>
            </div>
            <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li>Use the generated honeypot field name from the dashboard.</li>
              <li>Keep the field hidden with CSS or inline styles.</li>
              <li>Do not add a label or instructions for the honeypot field.</li>
              <li>Review flagged submissions in case of false positives.</li>
            </ul>
          </div>
        </section>

        <Separator className="my-12" />

        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="text-primary h-4 w-4" />
            Templates
          </div>
          <h2 className="text-2xl font-semibold">Form templates</h2>
          <p className="text-muted-foreground max-w-3xl">
            Templates are step-by-step tutorials that walk you through creating specific
            types of forms. Each tutorial covers creating the endpoint, configuring
            fields, adding spam protection, and embedding the HTML on your site.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TemplateCard
              title="Contact Form"
              description="Collect inbound messages with name, email, and message fields."
              href="/docs/templates/contact"
              icon={MessageSquare}
            />
            <TemplateCard
              title="Waiting List"
              description="Capture early interest with a high-conversion signup form."
              href="/docs/templates/waiting-list"
              icon={Users}
            />
            <TemplateCard
              title="Newsletter Signup"
              description="Grow your subscriber list with a minimal email signup form."
              href="/docs/templates/newsletter"
              icon={Newspaper}
            />
            <TemplateCard
              title="Product Feedback"
              description="Collect structured feedback with ratings and open-ended responses."
              href="/docs/templates/feedback"
              icon={Star}
            />
            <TemplateCard
              title="Bug Report"
              description="Structured bug reports with severity and steps to reproduce."
              href="/docs/templates/bug-report"
              icon={Bug}
            />
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/docs/templates"
              className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              View all templates
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-muted-foreground text-sm">
              &mdash; including upcoming RSVP and lead capture tutorials.
            </span>
          </div>
        </section>
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

function StepItem({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold">
        {number}
      </span>
      <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function TemplateCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      to={href}
      className="bg-card hover:border-foreground/20 focus-visible:border-foreground/30 focus-visible:ring-ring block rounded-2xl border p-5 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Icon className="text-primary h-4 w-4" />
        </div>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </Link>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  Clock,
  Mail,
  MessageSquare,
  Newspaper,
  Star,
  Users,
} from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/docs/templates/")({
  head: () => ({
    meta: [
      {
        title: "Templates | BForms Docs",
      },
      {
        name: "description",
        content:
          "Ready-made form templates for common use cases. Step-by-step tutorials for contact forms, waiting lists, feedback forms, and more.",
      },
    ],
  }),
  component: TemplatesDocPage,
});

const templates = [
  {
    slug: "/docs/templates/contact" as const,
    title: "Contact Form",
    description:
      "Collect inbound messages from your website visitors. Includes name, email, and message fields with spam protection.",
    icon: MessageSquare,
    fields: ["name", "email", "message"],
    ready: true,
  },
  {
    slug: "/docs/templates/waiting-list" as const,
    title: "Waiting List",
    description:
      "Capture early interest before your product launches. Minimal form optimized for high conversion with optional role segmentation.",
    icon: Users,
    fields: ["email", "role"],
    ready: true,
  },
  {
    slug: "/docs/templates/newsletter" as const,
    title: "Newsletter Signup",
    description:
      "Grow your subscriber list with a minimal, high-conversion signup form. Includes optional first name for personalized emails.",
    icon: Newspaper,
    fields: ["email", "first_name"],
    ready: true,
  },
  {
    slug: "/docs/templates/feedback" as const,
    title: "Product Feedback",
    description:
      "Collect structured product feedback with ratings and open-ended responses. Great for post-launch iteration.",
    icon: Star,
    fields: ["rating", "what_went_well", "what_to_improve", "email"],
    ready: true,
  },
  {
    slug: "/docs/templates/bug-report" as const,
    title: "Bug Report",
    description:
      "Give your engineering team structured bug reports with severity, steps to reproduce, and expected vs. actual behavior.",
    icon: Bug,
    fields: ["subject", "severity", "description", "steps_to_reproduce", "email"],
    ready: true,
  },
  {
    slug: null,
    title: "Event RSVP",
    description:
      "Get attendance counts, guest numbers, and dietary preferences in one simple form.",
    icon: Clock,
    fields: ["full_name", "email", "guests", "dietary_notes"],
    ready: false,
  },
  {
    slug: null,
    title: "Lead Capture",
    description:
      "Qualify inbound leads with just enough context to follow up fast. Includes company and timeline fields.",
    icon: Mail,
    fields: ["name", "work_email", "company", "project_timeline"],
    ready: false,
  },
];

function TemplatesDocPage() {
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
          render={<Link to="/docs" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Docs
        </Button>

        <div className="space-y-4">
          <Badge variant="secondary">Templates</Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Form templates
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Each template is a step-by-step tutorial that walks you through creating a
            specific type of form in BForms &mdash; from setting up fields in the
            dashboard to embedding the final HTML on your site.
          </p>
        </div>

        <Separator className="my-10" />

        <section className="space-y-5">
          {templates.map((template) => (
            <TemplateCard key={template.title} template={template} />
          ))}
        </section>

        <Separator className="my-12" />

        <div className="bg-muted/40 rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">More templates coming soon</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            We are working on detailed tutorials for event RSVP and lead capture forms. In
            the meantime, you can create any form type using the{" "}
            <Link to="/docs" className="text-foreground underline underline-offset-4">
              getting started guide
            </Link>{" "}
            and customize the fields to match your use case.
          </p>
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

function TemplateCard({ template }: { template: (typeof templates)[number] }) {
  const Icon = template.icon;

  const content = (
    <div className="bg-card hover:border-foreground/20 flex items-start gap-5 rounded-2xl border p-6 transition">
      <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="text-primary h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{template.title}</h2>
          {template.ready ? (
            <Badge variant="secondary" className="text-xs">
              Tutorial available
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground text-xs">
              Coming soon
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          {template.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.fields.map((field) => (
            <span
              key={field}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {field}
            </span>
          ))}
        </div>
        {template.ready && (
          <div className="text-primary mt-3 flex items-center gap-1 text-sm font-medium">
            Read tutorial
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
    </div>
  );

  if (template.ready && template.slug) {
    return <Link to={template.slug}>{content}</Link>;
  }

  return content;
}

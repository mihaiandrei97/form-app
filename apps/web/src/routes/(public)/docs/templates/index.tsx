import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  MessageSquare,
  Newspaper,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export const Route = createFileRoute("/(public)/docs/templates/")({
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
  },
  {
    slug: "/docs/templates/waiting-list" as const,
    title: "Waiting List",
    description:
      "Capture early interest before your product launches. Minimal form optimized for high conversion with optional role segmentation.",
    icon: Users,
    fields: ["email", "role"],
  },
  {
    slug: "/docs/templates/newsletter" as const,
    title: "Newsletter Signup",
    description:
      "Grow your subscriber list with a minimal, high-conversion signup form. Includes optional first name for personalized emails.",
    icon: Newspaper,
    fields: ["email", "first_name"],
  },
  {
    slug: "/docs/templates/feedback" as const,
    title: "Product Feedback",
    description:
      "Collect structured product feedback with ratings and open-ended responses. Great for post-launch iteration.",
    icon: Star,
    fields: ["rating", "what_went_well", "what_to_improve", "email"],
  },
  {
    slug: "/docs/templates/bug-report" as const,
    title: "Bug Report",
    description:
      "Give your engineering team structured bug reports with severity, steps to reproduce, and expected vs. actual behavior.",
    icon: Bug,
    fields: ["subject", "severity", "description", "steps_to_reproduce", "email"],
  },
];

function TemplatesDocPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
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

      <section className="space-y-6">
        {templates.map((template) => (
          <TemplateCard key={template.title} template={template} />
        ))}
      </section>

      <Separator className="my-12" />
    </main>
  );
}

function TemplateCard({ template }: { template: (typeof templates)[number] }) {
  const Icon = template.icon;

  return (
    <Link to={template.slug} className="block">
      <div className="bg-card flex items-start gap-5 border-2 border-foreground p-6 shadow-[var(--shadow-brutal)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center">
          <Icon className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">{template.title}</h2>
            <Badge variant="secondary" className="text-xs">
              Tutorial available
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            {template.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.fields.map((field) => (
              <span
                key={field}
                className="bg-secondary text-muted-foreground border border-foreground/20 px-2.5 py-0.5 text-xs font-medium"
              >
                {field}
              </span>
            ))}
          </div>
          <div className="text-primary mt-3 flex items-center gap-1 text-sm font-medium">
            Read tutorial
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

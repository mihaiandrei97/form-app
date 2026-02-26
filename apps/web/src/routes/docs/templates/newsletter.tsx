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
import { SiteHeader } from "~/components/site-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CodeBlock } from "~/components/docs/code-block";

export const Route = createFileRoute("/docs/templates/newsletter")({
  head: () => ({
    meta: [
      {
        title: "Newsletter Signup Tutorial | BForms Docs",
      },
      {
        name: "description",
        content:
          "Step-by-step guide to creating a newsletter signup form with BForms. Collect subscribers with a minimal, high-conversion form.",
      },
    ],
  }),
  component: NewsletterTemplatePage,
});

function NewsletterTemplatePage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-12">
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
            Build a newsletter signup form
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            A newsletter signup is one of the simplest and most effective forms you can
            add to your site. This tutorial shows you how to create a minimal,
            high-conversion form that collects email addresses and optionally the
            subscriber&apos;s name so you can personalize your emails.
          </p>
        </div>

        {/* What you will build */}
        <div className="bg-muted/40 mt-10 rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">What you will build</h2>
          <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
            <li>
              A form with one or two fields: <strong>email</strong> (required) and an
              optional <strong>first name</strong>.
            </li>
            <li>
              Honeypot spam protection to keep fake signups out of your subscriber list.
            </li>
            <li>
              A redirect to a confirmation page that sets expectations (check your inbox,
              etc.).
            </li>
            <li>
              An inline-friendly layout that works in a blog sidebar, footer, or hero
              section.
            </li>
          </ul>
        </div>

        <Separator className="my-12" />

        {/* Step 1 */}
        <section className="space-y-6">
          <StepHeading number={1} title="Create the form in your dashboard" />
          <p className="text-muted-foreground leading-relaxed">
            Log in to your BForms dashboard and click <strong>New Form</strong>. On the{" "}
            <strong>Settings</strong> tab, name the form something like{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">Newsletter</code> or{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              Blog Subscribers
            </code>
            . This name is only visible in your dashboard.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 2 */}
        <section className="space-y-6">
          <StepHeading number={2} title="Set a redirect URL" />
          <p className="text-muted-foreground leading-relaxed">
            In the <strong>Redirect URL</strong> field, enter the URL of a confirmation
            page. This is where subscribers land after they sign up:
          </p>
          <CodeBlock filename="example" code="https://yoursite.com/subscribed" />
          <p className="text-muted-foreground leading-relaxed">
            A good confirmation page might say &quot;Thanks for subscribing! Check your
            inbox for a welcome email.&quot; If you leave this empty, BForms will show a
            default success message.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 3 */}
        <section className="space-y-6">
          <StepHeading number={3} title="Add your fields" />
          <p className="text-muted-foreground leading-relaxed">
            Switch to the <strong>Fields</strong> tab. For a newsletter, fewer fields
            means higher conversion. Start with just email, and optionally add a first
            name for personalization.
          </p>

          <div className="space-y-4">
            <FieldCard
              name="email"
              type="Email"
              label="Email"
              placeholder="you@example.com"
              required
              description="The only essential field. Uses the email input type for built-in browser validation."
            />
            <FieldCard
              name="first_name"
              type="Text"
              label="First name"
              placeholder="Jane"
              description="Optional. Lets you personalize subject lines and greetings. Skip this if you want the absolute simplest form."
            />
          </div>

          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">One field or two?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              A single email field converts best. Adding a first name field reduces
              conversion slightly but lets you personalize emails with &quot;Hi Jane&quot;
              instead of &quot;Hi there&quot;. Choose based on your priorities &mdash; you
              can always add the name field later without breaking anything.
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 4 */}
        <section className="space-y-6">
          <StepHeading number={4} title="Enable spam protection" />
          <div className="flex items-start gap-3">
            <Shield className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              Back on the <strong>Settings</strong> tab, enter a name for the{" "}
              <strong>Honeypot Field</strong>. Newsletter forms are prime targets for bots
              because they are usually on high-traffic public pages. A honeypot field is
              essential to keep your subscriber list clean.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The default{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">_honeypot</code>{" "}
            works fine. The honeypot is a hidden field that bots fill out but real
            visitors never see. Submissions with a value in this field are silently
            discarded.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 5 */}
        <section className="space-y-6">
          <StepHeading number={5} title="Restrict allowed domains" />
          <div className="flex items-start gap-3">
            <Globe className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              In the <strong>Allowed Domains</strong> field, add the domains where you
              will embed this form. This prevents someone from copying your form snippet
              and collecting subscribers on a different site.
            </p>
          </div>
          <CodeBlock filename="allowed domains" code="yoursite.com, blog.yoursite.com" />
        </section>

        <Separator className="my-10" />

        {/* Step 6 */}
        <section className="space-y-6">
          <StepHeading number={6} title="Embed the form on your site" />
          <p className="text-muted-foreground leading-relaxed">
            Click <strong>Create Form</strong> to save your endpoint. Copy the HTML below
            and paste it wherever you want the signup form &mdash; a blog sidebar, footer,
            hero section, or dedicated landing page. Replace{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">your-form-slug</code>{" "}
            with the actual slug from your dashboard.
          </p>

          <CodeBlock
            filename="newsletter.html"
            code={`<form action="https://bforms.dev/api/f/your-form-slug" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" required />

  <label for="first_name">First name (optional)</label>
  <input type="text" id="first_name" name="first_name" placeholder="Jane" />

  <!-- Honeypot field - do not remove -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Subscribe</button>
</form>`}
          />

          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">Inline layout tip</p>
            <p className="text-muted-foreground mt-1 text-sm">
              For a compact inline layout (email input + button on one line), wrap the
              email input and button in a flex container with{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">
                display: flex; gap: 8px;
              </code>
              . This works well in sidebars and footers where vertical space is limited.
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 7 */}
        <section className="space-y-6">
          <StepHeading number={7} title="Set up email notifications (optional)" />
          <div className="flex items-start gap-3">
            <Mail className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              If you want to know when someone subscribes, configure a notification
              channel on the form detail page. This sends you an email for every new
              signup. Useful in the early days when you want to personally welcome new
              subscribers.
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 8 */}
        <section className="space-y-6">
          <StepHeading number={8} title="Test your form" />
          <p className="text-muted-foreground leading-relaxed">
            Before going live, run through these checks:
          </p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Submit a test email and confirm it appears in your BForms dashboard.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Verify you are redirected to your confirmation page.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Test the honeypot by making it visible, filling it in, and confirming the
              submission is discarded.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Check that the form renders well on mobile.
            </li>
          </ul>
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
              title="Use a double opt-in flow"
              description="After someone subscribes, send a confirmation email with a link they must click. This ensures valid email addresses and keeps your list healthy."
            />
            <TipCard
              title="Add a source field"
              description='Add a hidden input like <input type="hidden" name="source" value="blog-footer" /> to track where subscribers come from.'
            />
            <TipCard
              title="Keep it above the fold"
              description="Place the form where visitors can see it without scrolling. Blog sidebars, site headers, and hero sections all work well."
            />
            <TipCard
              title="Async submission with fetch"
              description="Use the JavaScript snippet from your dashboard to submit without a page reload. Show a success message inline instead of redirecting."
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
            render={<Link to="/docs/templates/waiting-list" />}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Waiting list tutorial
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to="/docs/templates/feedback" />}
          >
            Feedback form tutorial
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

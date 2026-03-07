import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "~/components/site-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CodeBlock } from "~/components/docs/code-block";

export const Route = createFileRoute("/docs/templates/waiting-list")({
  head: () => ({
    meta: [
      {
        title: "Waiting List Tutorial | BForms Docs",
      },
      {
        name: "description",
        content:
          "Step-by-step guide to creating a waiting list form with BForms. Capture early interest, segment signups by role, and embed a high-conversion form on your landing page.",
      },
    ],
  }),
  component: WaitingListTemplatePage,
});

function WaitingListTemplatePage() {
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
            Build a waiting list form
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            A waiting list form helps you capture early interest before your product
            launches. This tutorial shows you how to create a high-conversion form that
            collects email addresses and optional segmentation data, protect it from spam,
            and embed it on your landing page.
          </p>
        </div>

        {/* What you will build */}
        <div className="bg-muted/40 mt-10 rounded-2xl border p-6">
          <h2 className="text-lg font-semibold">What you will build</h2>
          <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
            <li>
              A minimal form with two fields: <strong>email</strong> (required) and{" "}
              <strong>role</strong> (optional select).
            </li>
            <li>Honeypot spam protection to keep your list clean from bot signups.</li>
            <li>A redirect to a custom thank-you or confirmation page.</li>
            <li>Segmentation data so you can prioritize outreach by role.</li>
          </ul>
        </div>

        <Separator className="my-12" />

        {/* Step 1 */}
        <section className="space-y-6">
          <StepHeading number={1} title="Create the form in your dashboard" />
          <p className="text-muted-foreground leading-relaxed">
            Log in to your BForms dashboard and click <strong>New Form</strong>. On the{" "}
            <strong>Settings</strong> tab, give your form a name like{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">Waiting List</code>{" "}
            or{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
              Early Access Signup
            </code>
            . This name is only visible in your dashboard.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 2 */}
        <section className="space-y-6">
          <StepHeading number={2} title="Set a redirect to your thank-you page" />
          <p className="text-muted-foreground leading-relaxed">
            In the <strong>Redirect URL</strong> field, enter the URL where visitors
            should land after signing up. For a waiting list, this is often a page that
            confirms their spot and sets expectations:
          </p>
          <CodeBlock filename="example" code="https://yoursite.com/thanks" />
          <p className="text-muted-foreground leading-relaxed">
            A good thank-you page for a waiting list might include the visitor's queue
            position, a share link so they can refer others, or an estimated launch date.
            If you leave the redirect URL empty, BForms will show a generic success
            message.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 3 */}
        <section className="space-y-6">
          <StepHeading number={3} title="Configure your fields" />
          <p className="text-muted-foreground leading-relaxed">
            Switch to the <strong>Fields</strong> tab and add the fields below. Waiting
            list forms convert best when they are short, so start with just two fields.
            You can always add more later.
          </p>

          <div className="space-y-4">
            <FieldCard
              name="email"
              type="Email"
              label="Email"
              placeholder="you@example.com"
              required
              description="The only truly essential field. Uses the email input type for built-in browser validation."
            />
            <FieldCard
              name="role"
              type="Select"
              label="Role"
              placeholder="Select your role"
              description="An optional select field that lets you segment signups. Useful for prioritizing outreach to founders, product managers, or engineers."
              options={["Founder", "Product", "Engineering", "Marketing", "Other"]}
            />
          </div>

          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">Why keep the form short?</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Every extra field reduces conversion. For a waiting list, your primary goal
              is capturing the email address. The role field is worth the slight friction
              because it gives you actionable segmentation data. Avoid adding fields like
              &quot;company name&quot; or &quot;phone number&quot; unless you have a
              specific use for them at this stage.
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
              <strong>Honeypot Field</strong>. This adds a hidden field to your form that
              bots will fill out but real visitors will not. Any submission that includes
              a value for this field is automatically discarded.
            </p>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The default suggestion is{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">_honeypot</code>. You
            can use any name you like &mdash; just make sure it matches the hidden input
            in your HTML (shown in Step 6).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Spam protection is especially important for waiting list forms because they
            are typically placed on public landing pages with high traffic. Without a
            honeypot, your list can quickly fill up with fake signups.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 5 */}
        <section className="space-y-6">
          <StepHeading number={5} title="Restrict allowed domains" />
          <div className="flex items-start gap-3">
            <Globe className="text-primary mt-1 h-5 w-5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed">
              In the <strong>Allowed Domains</strong> field, enter the domains where this
              form will live. This prevents anyone from copying your form snippet and
              collecting signups on a different site.
            </p>
          </div>
          <CodeBlock filename="allowed domains" code="yoursite.com, www.yoursite.com" />
          <p className="text-muted-foreground leading-relaxed">
            Leave this empty during development so you can test from localhost. Add your
            production domains before you launch.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Step 6 */}
        <section className="space-y-6">
          <StepHeading number={6} title="Embed the form on your landing page" />
          <p className="text-muted-foreground leading-relaxed">
            Click <strong>Create Form</strong> to save your endpoint. BForms will generate
            a unique URL and code snippets. Copy the HTML below and paste it into your
            landing page. Replace{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-sm">your-form-slug</code>{" "}
            with the actual slug from your dashboard.
          </p>

          <CodeBlock
            filename="waiting-list.html"
            code={`<form action="https://bforms.dev/api/f/your-form-slug" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" required />

  <label for="role">Role (optional)</label>
  <select id="role" name="role">
    <option value="">Select your role</option>
    <option value="Founder">Founder</option>
    <option value="Product">Product</option>
    <option value="Engineering">Engineering</option>
    <option value="Marketing">Marketing</option>
    <option value="Other">Other</option>
  </select>

  <!-- Honeypot field - do not remove -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Join the Waitlist</button>
</form>`}
          />

          <div className="bg-muted/40 rounded-xl border p-5">
            <p className="text-sm font-medium">Inline vs. full-page form</p>
            <p className="text-muted-foreground mt-1 text-sm">
              For maximum conversion, embed the form directly on your landing page hero
              section rather than linking to a separate page. Visitors should be able to
              sign up without scrolling or navigating away. If you are using a single-page
              app, consider the JavaScript snippet from your dashboard to submit via fetch
              without a page reload.
            </p>
          </div>
        </section>

        <Separator className="my-10" />

        {/* Step 7 */}
        <section className="space-y-6">
          <StepHeading number={7} title="Test and launch" />
          <p className="text-muted-foreground leading-relaxed">
            Before sharing your landing page, run through these checks:
          </p>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Submit a test signup and confirm it appears in your BForms dashboard.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Verify you are redirected to your thank-you page after submitting.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Test the honeypot by temporarily making it visible, filling it in, and
              confirming the submission is discarded.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              Check that the role select value is captured correctly in the dashboard.
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Once everything looks good, share your landing page and start collecting
            signups. Every submission is stored in your dashboard where you can review,
            filter, and export them.
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
              title="Track campaign sources"
              description="Add a hidden input like <source> with a value that identifies where the signup came from (e.g. 'twitter', 'producthunt'). This helps you measure which channels drive the most signups."
            />
            <TipCard
              title="Segment by role"
              description="Use the role field to prioritize your outreach. Founders and product managers may be your best early adopters and can give valuable feedback."
            />
            <TipCard
              title="Use fetch for SPA embedding"
              description="If your landing page is a single-page app, use the JavaScript snippet from your dashboard to submit via fetch. This avoids a full page reload and lets you show a success message inline."
            />
            <TipCard
              title="Enable email notifications"
              description="Configure a notification channel on the form detail page in your dashboard. You will receive an email for every new signup so you can follow up quickly."
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
            render={<Link to="/docs/templates/contact" />}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Contact form tutorial
          </Button>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to="/docs/templates/newsletter" />}
          >
            Newsletter tutorial
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
  options,
}: {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  description: string;
  options?: string[];
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
      {options && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {options.map((opt) => (
            <span
              key={opt}
              className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs"
            >
              {opt}
            </span>
          ))}
        </div>
      )}
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

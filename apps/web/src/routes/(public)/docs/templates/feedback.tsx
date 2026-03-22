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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CodeBlock } from "~/components/docs/code-block";

export const Route = createFileRoute("/(public)/docs/templates/feedback")({
  head: () => ({
    meta: [
      {
        title: "Feedback Form Tutorial | BForms Docs",
      },
      {
        name: "description",
        content:
          "Step-by-step guide to creating a product feedback form with BForms. Collect ratings, structured input, and open-ended responses from your users.",
      },
    ],
  }),
  component: FeedbackTemplatePage,
});

function FeedbackTemplatePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
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
        <Badge
          variant="secondary"
          className="docs-accent-surface"
        >
          Template Tutorial
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Build a product feedback form
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Collecting structured feedback from your users is one of the most valuable
          things you can do after launching a product. This tutorial shows you how to
          create a feedback form that captures a rating, what went well, what needs
          improvement, and an optional email for follow-up.
        </p>
      </div>

      {/* What you will build */}
      <div className="bg-muted/40 mt-10 border-2 border-foreground p-6 shadow-[var(--shadow-brutal)]">
        <h2 className="text-lg font-semibold">What you will build</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            A form with four fields: <strong>rating</strong> (select),{" "}
            <strong>what went well</strong> (textarea), <strong>what to improve</strong>{" "}
            (textarea), and <strong>email</strong> (optional).
          </li>
          <li>
            A structured format that makes it easy to spot patterns across many
            responses.
          </li>
          <li>Honeypot spam protection to filter out bot submissions.</li>
          <li>Notifications so you can act on feedback quickly.</li>
        </ul>
      </div>

      <Separator className="my-12" />

      {/* Step 1 */}
      <section className="space-y-6">
        <StepHeading number={1} title="Create the form in your dashboard" />
        <p className="text-muted-foreground leading-relaxed">
          Log in to your BForms dashboard and click <strong>New Form</strong>. On the{" "}
          <strong>Settings</strong> tab, name it something like{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
            Product Feedback
          </code>{" "}
          or{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">User Feedback</code>.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 2 */}
      <section className="space-y-6">
        <StepHeading number={2} title="Set a redirect URL" />
        <p className="text-muted-foreground leading-relaxed">
          In the <strong>Redirect URL</strong> field, enter the URL of a thank-you page.
          Since feedback forms are usually shown inside your app, this might redirect
          back to the dashboard or a &quot;Thanks for your feedback&quot; page:
        </p>
        <CodeBlock filename="example" code="https://yourapp.com/feedback/thanks" />
        <p className="text-muted-foreground leading-relaxed">
          If you plan to submit the form via JavaScript (no page reload), you can leave
          this empty and show a success message inline instead.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 3 */}
      <section className="space-y-6">
        <StepHeading number={3} title="Add your fields" />
        <p className="text-muted-foreground leading-relaxed">
          Switch to the <strong>Fields</strong> tab. A good feedback form balances
          structured data (the rating) with open-ended questions that let users explain
          their thinking.
        </p>

        <div className="space-y-4">
          <FieldCard
            name="rating"
            type="Select"
            label="Rating"
            placeholder="Select a rating"
            required
            description="A 1-5 rating gives you a quick quantitative signal. Easy to aggregate and track over time."
            options={[
              "1 - Very poor",
              "2 - Poor",
              "3 - Okay",
              "4 - Good",
              "5 - Excellent",
            ]}
          />
          <FieldCard
            name="what_went_well"
            type="Textarea"
            label="What went well?"
            placeholder="Tell us what you liked..."
            description="Open-ended positive feedback. Helps you understand what to keep doing and what resonates with users."
          />
          <FieldCard
            name="what_to_improve"
            type="Textarea"
            label="What could be improved?"
            placeholder="Tell us what could be better..."
            description="Open-ended constructive feedback. This is where you find your most actionable insights."
          />
          <FieldCard
            name="email"
            type="Email"
            label="Email (optional)"
            placeholder="you@example.com"
            description="Optional. Lets you follow up with the user for clarification. Mark this as not required so it doesn't discourage anonymous feedback."
          />
        </div>

        <div className="bg-muted/40 border-2 border-foreground p-5">
          <p className="text-sm font-medium">
            Why two separate text fields instead of one?
          </p>
          <p className="docs-soft-text mt-1 text-sm">
            Asking &quot;what went well&quot; and &quot;what to improve&quot; separately
            prompts more thoughtful responses than a single &quot;any feedback?&quot;
            box. It also makes it easier to categorize responses in your dashboard
            &mdash; you can scan the &quot;improve&quot; column to find pain points
            without reading every full response.
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
            Back on the <strong>Settings</strong> tab, set a{" "}
            <strong>Honeypot Field</strong> name. Even if the form is only shown to
            logged-in users, bots can still find and submit to the endpoint directly.
            The honeypot adds a safety net.
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Use the default{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">_honeypot</code> or
          choose your own name. The hidden field is included in the HTML snippet below.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 5 */}
      <section className="space-y-6">
        <StepHeading number={5} title="Configure allowed domains" />
        <div className="flex items-start gap-3">
          <Globe className="text-primary mt-1 h-5 w-5 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">
            In the <strong>Allowed Domains</strong> field, add the domain where your app
            runs. If the feedback form is only available inside your app, this is an
            important layer of protection:
          </p>
        </div>
        <CodeBlock filename="allowed domains" code="yourapp.com" />
      </section>

      <Separator className="my-10" />

      {/* Step 6 */}
      <section className="space-y-6">
        <StepHeading number={6} title="Embed the form" />
        <p className="text-muted-foreground leading-relaxed">
          Click <strong>Create Form</strong> and copy the HTML snippet below. Replace{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 text-sm">your-form-slug</code>{" "}
          with the actual slug from your dashboard.
        </p>

        <CodeBlock
          filename="feedback.html"
          code={`<form action="https://bforms.dev/api/f/your-form-slug" method="POST">
  <label for="rating">How would you rate your experience?</label>
  <select id="rating" name="rating" required>
    <option value="">Select a rating</option>
    <option value="1">1 - Very poor</option>
    <option value="2">2 - Poor</option>
    <option value="3">3 - Okay</option>
    <option value="4">4 - Good</option>
    <option value="5">5 - Excellent</option>
  </select>

  <label for="what_went_well">What went well?</label>
  <textarea id="what_went_well" name="what_went_well" placeholder="Tell us what you liked..."></textarea>

  <label for="what_to_improve">What could be improved?</label>
  <textarea id="what_to_improve" name="what_to_improve" placeholder="Tell us what could be better..."></textarea>

  <label for="email">Email (optional)</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" />

  <!-- Honeypot field - do not remove -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send Feedback</button>
</form>`}
        />

        <div className="bg-muted/40 border-2 border-foreground p-5">
          <p className="text-sm font-medium">In-app feedback with JavaScript</p>
          <p className="docs-soft-text mt-1 text-sm">
            If the feedback form lives inside your app, you probably want to submit it
            via the fetch API to avoid a full page reload. Use the JavaScript snippet
            from your dashboard. After a successful submission, show a toast or success
            message inline and optionally close a modal.
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Step 7 */}
      <section className="space-y-6">
        <StepHeading number={7} title="Enable notifications" />
        <div className="flex items-start gap-3">
          <Mail className="text-primary mt-1 h-5 w-5 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">
            For a feedback form, notifications are especially useful. Set up an email
            notification channel so your product team sees new feedback as it comes in.
            This lets you act on critical issues quickly rather than checking the
            dashboard periodically.
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Step 8 */}
      <section className="space-y-6">
        <StepHeading number={8} title="Test your form" />
        <p className="text-muted-foreground leading-relaxed">
          Before making the form available to your users, verify the following:
        </p>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Submit test feedback with different ratings and confirm all fields appear
            correctly in the dashboard.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Submit without an email to confirm the optional field works.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Verify the redirect or inline success message works as expected.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Test the honeypot to confirm spam submissions are discarded.
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
            title="Time it right"
            description="Show the feedback form after a meaningful interaction — after a user completes a task, finishes onboarding, or has been active for a week. Avoid interrupting core workflows."
          />
          <TipCard
            title="Track the page or feature"
            description='Add a hidden input with the page or feature name so you know what the user was doing when they submitted. Example: <input type="hidden" name="feature" value="dashboard" />'
          />
          <TipCard
            title="Review regularly"
            description="Set a weekly cadence to review feedback in your BForms dashboard. Look for patterns in ratings and recurring themes in the text fields."
          />
          <TipCard
            title="Follow up on low ratings"
            description="When someone leaves a 1 or 2 star rating with an email, reach out within 24 hours. Users who feel heard often become your strongest advocates."
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
          render={<Link to="/docs/templates/newsletter" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Newsletter tutorial
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link to="/docs/templates/bug-report" />}
        >
          Bug report tutorial
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="docs-step-number inline-flex h-8 w-8 items-center justify-center border-2 text-sm font-bold [box-shadow:var(--shadow-brutal)]">
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
    <div className="bg-muted/40 border-2 border-foreground p-4">
      <div className="flex items-center gap-3">
        <code className="docs-accent-surface border px-2 py-0.5 text-xs font-semibold">
          {type}
        </code>
        <span className="text-sm font-semibold">{label}</span>
        {required && (
          <Badge
              variant="secondary"
              className="docs-accent-surface text-xs"
            >
            Required
          </Badge>
        )}
      </div>
      <p className="docs-soft-text mt-2 text-sm">{description}</p>
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
              className="docs-secondary-chip border px-2.5 py-0.5 text-xs"
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
    <div className="bg-muted/40 border-2 border-foreground p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="docs-soft-text mt-1 text-sm">{description}</p>
    </div>
  );
}

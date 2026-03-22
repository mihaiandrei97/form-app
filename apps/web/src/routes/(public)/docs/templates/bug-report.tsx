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

export const Route = createFileRoute("/(public)/docs/templates/bug-report")({
  head: () => ({
    meta: [
      {
        title: "Bug Report Form Tutorial | BForms Docs",
      },
      {
        name: "description",
        content:
          "Step-by-step guide to creating a bug report form with BForms. Collect structured bug reports with severity, steps to reproduce, and expected vs. actual behavior.",
      },
    ],
  }),
  component: BugReportTemplatePage,
});

function BugReportTemplatePage() {
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
          Build a bug report form
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          A well-structured bug report form saves your engineering team hours of
          back-and-forth. This tutorial shows you how to create a form that collects
          everything needed to reproduce and prioritize a bug &mdash; severity,
          description, steps to reproduce, and expected vs. actual behavior.
        </p>
      </div>

      {/* What you will build */}
      <div className="bg-muted/40 mt-10 border-2 border-foreground p-6">
        <h2 className="text-lg font-semibold">What you will build</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            A form with six fields: <strong>subject</strong>, <strong>severity</strong>{" "}
            (select), <strong>description</strong> (textarea),{" "}
            <strong>steps to reproduce</strong> (textarea),{" "}
            <strong>expected behavior</strong> (textarea), and <strong>email</strong>{" "}
            for follow-up.
          </li>
          <li>Severity levels so your team can triage bugs by impact.</li>
          <li>
            Structured fields that give developers the context they need to investigate
            without asking follow-up questions.
          </li>
          <li>Spam protection and domain restrictions for security.</li>
        </ul>
      </div>

      <Separator className="my-12" />

      {/* Step 1 */}
      <section className="space-y-6">
        <StepHeading number={1} title="Create the form in your dashboard" />
        <p className="text-muted-foreground leading-relaxed">
          Log in to your BForms dashboard and click <strong>New Form</strong>. On the{" "}
          <strong>Settings</strong> tab, name the form{" "}
          <code className="bg-muted border border-foreground px-1.5 py-0.5 text-sm">
            Bug Reports
          </code>{" "}
          or{" "}
          <code className="bg-muted border border-foreground px-1.5 py-0.5 text-sm">
            Issue Tracker
          </code>
          . If you have multiple products, include the product name to keep things
          organized.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 2 */}
      <section className="space-y-6">
        <StepHeading number={2} title="Set a redirect URL" />
        <p className="text-muted-foreground leading-relaxed">
          In the <strong>Redirect URL</strong> field, enter a page that confirms the
          report was received and sets expectations for response time:
        </p>
        <CodeBlock filename="example" code="https://yourapp.com/bugs/thanks" />
        <p className="text-muted-foreground leading-relaxed">
          A good confirmation page might say &quot;Thanks for the report. We will
          investigate and respond within 2 business days.&quot; If you submit via
          JavaScript, leave this empty and show a success message inline.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 3 */}
      <section className="space-y-6">
        <StepHeading number={3} title="Add your fields" />
        <p className="text-muted-foreground leading-relaxed">
          Switch to the <strong>Fields</strong> tab. Bug report forms need more fields
          than most forms because they serve a technical audience. Every field here
          reduces follow-up questions for your engineers.
        </p>

        <div className="space-y-4">
          <FieldCard
            name="subject"
            type="Text"
            label="Subject"
            placeholder="Brief summary of the issue"
            required
            description="A short title that makes it easy to scan reports in the dashboard. Example: 'Login button unresponsive on mobile'."
          />
          <FieldCard
            name="severity"
            type="Select"
            label="Severity"
            placeholder="Select severity"
            required
            description="Helps your team triage bugs by impact. Critical issues get addressed first."
            options={[
              "Critical - App unusable",
              "High - Major feature broken",
              "Medium - Feature impaired",
              "Low - Minor issue or cosmetic",
            ]}
          />
          <FieldCard
            name="description"
            type="Textarea"
            label="Description"
            placeholder="Describe the issue in detail..."
            required
            description="A detailed explanation of what happened. Encourage users to include context like browser, device, or what they were doing."
          />
          <FieldCard
            name="steps_to_reproduce"
            type="Textarea"
            label="Steps to reproduce"
            placeholder="1. Go to...\n2. Click on...\n3. See error"
            description="A numbered list of steps to trigger the bug. This is the most valuable field for your engineering team."
          />
          <FieldCard
            name="expected_behavior"
            type="Textarea"
            label="Expected behavior"
            placeholder="What did you expect to happen?"
            description="Clarifies what the user thought should have happened. Helps disambiguate whether something is a bug or a misunderstanding."
          />
          <FieldCard
            name="email"
            type="Email"
            label="Email"
            placeholder="you@example.com"
            required
            description="Required so your team can follow up with questions or notify the reporter when the bug is fixed."
          />
        </div>

        <div className="bg-muted/40 border-2 border-foreground p-5">
          <p className="text-sm font-medium">Why so many fields?</p>
          <p className="docs-soft-text mt-1 text-sm">
            Bug reports are different from most forms. Each field serves a specific
            purpose in the triage and debugging process. A vague &quot;something is
            broken&quot; report with no steps to reproduce wastes your team&apos;s time.
            These fields guide the reporter into providing useful, actionable
            information. You can make &quot;steps to reproduce&quot; and &quot;expected
            behavior&quot; optional if you prefer a lower-friction form.
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
            <strong>Honeypot Field</strong> name. Even if the bug report form is behind
            authentication, the endpoint URL is public and bots can submit to it
            directly. The honeypot adds an extra layer of protection.
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      {/* Step 5 */}
      <section className="space-y-6">
        <StepHeading number={5} title="Restrict allowed domains" />
        <div className="flex items-start gap-3">
          <Globe className="text-primary mt-1 h-5 w-5 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">
            Add your app&apos;s domain in the <strong>Allowed Domains</strong> field.
            Since bug report forms typically live inside your product, this ensures only
            submissions from your domain are accepted:
          </p>
        </div>
        <CodeBlock filename="allowed domains" code="yourapp.com" />
      </section>

      <Separator className="my-10" />

      {/* Step 6 */}
      <section className="space-y-6">
        <StepHeading number={6} title="Embed the form" />
        <p className="text-muted-foreground leading-relaxed">
          Click <strong>Create Form</strong> and copy the HTML below. Replace{" "}
          <code className="bg-muted border border-foreground px-1.5 py-0.5 text-sm">
            your-form-slug
          </code>{" "}
          with the actual slug from your dashboard.
        </p>

        <CodeBlock
          filename="bug-report.html"
          code={`<form action="https://bforms.dev/api/f/your-form-slug" method="POST">
  <label for="subject">Subject</label>
  <input type="text" id="subject" name="subject" placeholder="Brief summary of the issue" required />

  <label for="severity">Severity</label>
  <select id="severity" name="severity" required>
    <option value="">Select severity</option>
    <option value="critical">Critical - App unusable</option>
    <option value="high">High - Major feature broken</option>
    <option value="medium">Medium - Feature impaired</option>
    <option value="low">Low - Minor issue or cosmetic</option>
  </select>

  <label for="description">Description</label>
  <textarea id="description" name="description" placeholder="Describe the issue in detail..." required></textarea>

  <label for="steps_to_reproduce">Steps to reproduce</label>
  <textarea id="steps_to_reproduce" name="steps_to_reproduce" placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"></textarea>

  <label for="expected_behavior">Expected behavior</label>
  <textarea id="expected_behavior" name="expected_behavior" placeholder="What did you expect to happen?"></textarea>

  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" required />

  <!-- Honeypot field - do not remove -->
  <input type="text" name="_honeypot" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Submit Bug Report</button>
</form>`}
        />

        <div className="bg-muted/40 border-2 border-foreground p-5">
          <p className="text-sm font-medium">Add context automatically</p>
          <p className="docs-soft-text mt-1 text-sm">
            Use hidden inputs to capture context the user might forget to include. For
            example, add{" "}
            <code className="bg-muted border border-foreground px-1 py-0.5 text-xs">
              &lt;input type=&quot;hidden&quot; name=&quot;page_url&quot;
              value=&quot;&quot; /&gt;
            </code>{" "}
            and set its value to{" "}
            <code className="bg-muted border border-foreground px-1 py-0.5 text-xs">
              window.location.href
            </code>{" "}
            with JavaScript. You can also capture the browser user agent automatically.
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
            For a bug report form, notifications are essential. Configure an email
            notification channel that delivers to your engineering team&apos;s inbox or
            shared channel. Critical bugs should be visible immediately, not sitting
            unread in a dashboard.
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          You can add multiple notification email addresses if different people handle
          different areas of your product.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Step 8 */}
      <section className="space-y-6">
        <StepHeading number={8} title="Test your form" />
        <p className="text-muted-foreground leading-relaxed">
          Submit a test bug report and verify:
        </p>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            All fields appear correctly in your BForms dashboard, including the severity
            select value.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            The redirect or inline success message works as expected.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Your engineering team receives the email notification.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            Optional fields (steps to reproduce, expected behavior) can be left empty
            without errors.
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            The honeypot correctly discards bot submissions.
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
            title="Auto-capture browser info"
            description="Use JavaScript to populate hidden fields with the browser user agent, screen resolution, and current URL. This saves reporters from having to describe their setup."
          />
          <TipCard
            title="Add a screenshot upload prompt"
            description="While BForms doesn't handle file uploads directly, you can add a text field for a screenshot URL (e.g. a link to an image on Imgur or a cloud storage service)."
          />
          <TipCard
            title="Triage by severity"
            description="Filter submissions by the severity field in your dashboard. Address critical and high bugs first, then batch medium and low issues into your next sprint."
          />
          <TipCard
            title="Close the loop"
            description="When a bug is fixed, email the reporter to let them know. This builds trust and encourages future reports. Use the email field to follow up."
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
          render={<Link to="/docs/templates/feedback" />}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Feedback form tutorial
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link to="/docs/templates" />}
        >
          All templates
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
          name:{" "}
          <code className="bg-muted border border-foreground px-1 py-0.5">{name}</code>
        </span>
        <span>
          placeholder:{" "}
          <code className="bg-muted border border-foreground px-1 py-0.5">
            {placeholder}
          </code>
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

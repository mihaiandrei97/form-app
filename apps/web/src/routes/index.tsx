import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Code2,
  Globe,
  Mail,
  MessageSquare,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Suspense } from "react";
import { SiteHeader } from "~/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { highlightedCodeQueryOptions } from "~/lib/code-highlight";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "BForms - Form endpoints for your websites" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-muted/40 absolute inset-0" />
        <div className="bg-primary/10 absolute top-12 -left-20 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-secondary/50 absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-36">
          <div className="bg-card/70 text-muted-foreground mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            No backend required. Free to start.
          </div>

          <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-6xl md:leading-tight">
            Form endpoints for
            <span className="text-primary"> any website</span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl">
            Add contact forms, feedback widgets, and surveys to any website in minutes.
            Just point your HTML form to BForms and start collecting submissions.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/login" />}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link to="/pricing" />}
            >
              View Pricing
            </Button>
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            Free tier includes 5 forms and 100 submissions/month
          </p>
        </div>
      </section>

      {/* Social Proof / Trust Bar */}
      <section className="border-y">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-4 py-8 sm:flex-row sm:gap-12">
          <TrustItem icon={<Zap className="h-4 w-4" />} text="Setup in 60 seconds" />
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <TrustItem
            icon={<Shield className="h-4 w-4" />}
            text="Spam protection built-in"
          />
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <TrustItem
            icon={<Globe className="h-4 w-4" />}
            text="Works with any platform"
          />
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <TrustItem icon={<Mail className="h-4 w-4" />} text="Email notifications" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Three steps. That&apos;s it.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              No SDKs, no dependencies, no build steps. Just HTML.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <StepCard
              number={1}
              title="Create a form endpoint"
              description="Sign up and create a form endpoint from your dashboard. Configure email notifications and set allowed domains."
            />
            <StepCard
              number={2}
              title="Add the snippet to your site"
              description="Copy the form action URL and paste it into your HTML. Works with any website builder, framework, or static site."
            />
            <StepCard
              number={3}
              title="Collect submissions"
              description="Submissions appear in your dashboard instantly. Get email alerts for every new response."
            />
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="bg-muted/40 relative overflow-hidden py-20 md:py-28">
        <div className="bg-primary/5 absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                Integration
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Drop-in simple
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                If you can write an HTML form, you can use BForms. No JavaScript SDK, no
                npm packages, no API keys in your frontend code.
              </p>
              <ul className="mt-6 space-y-3">
                <CheckItem text="Plain HTML — works everywhere" />
                <CheckItem text="No client-side JavaScript needed" />
                <CheckItem text="Custom redirect after submission" />
                <CheckItem text="Honeypot spam filtering included" />
              </ul>
              <Button className="mt-8" nativeButton={false} render={<Link to="/login" />}>
                Create Your First Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-card rounded-2xl border p-1">
              <div className="bg-muted/60 flex items-center gap-2 rounded-t-xl px-4 py-3">
                <div className="bg-destructive/40 h-3 w-3 rounded-full" />
                <div className="bg-chart-4/40 h-3 w-3 rounded-full" />
                <div className="bg-chart-5/40 h-3 w-3 rounded-full" />
                <span className="text-muted-foreground ml-2 text-xs">contact.html</span>
              </div>
              <Suspense
                fallback={
                  <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
                    <code>{"Loading..."}</code>
                  </pre>
                }
              >
                <HighlightedCode />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              Built for developers and non-developers alike. Simple tools that just work.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Instant Setup"
              description="Create form endpoints in seconds. No server configuration, no deployment pipelines."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Spam Protection"
              description="Built-in honeypot fields automatically detect and filter bot submissions."
            />
            <FeatureCard
              icon={<Globe className="h-5 w-5" />}
              title="Domain Restrictions"
              description="Control exactly which websites can submit to your forms. Block unauthorized requests."
            />
            <FeatureCard
              icon={<Mail className="h-5 w-5" />}
              title="Email Notifications"
              description="Get notified instantly when someone submits a form. Configurable per-form."
            />
            <FeatureCard
              icon={<MessageSquare className="h-5 w-5" />}
              title="Submission Dashboard"
              description="View, search, and manage all form submissions from a clean, organized dashboard."
            />
            <FeatureCard
              icon={<Code2 className="h-5 w-5" />}
              title="Works Anywhere"
              description="React, Vue, WordPress, Webflow, plain HTML — if it can make a POST request, it works."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/40 relative overflow-hidden py-20 md:py-28">
        <div className="bg-primary/5 absolute top-0 -left-32 h-72 w-72 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Questions? Answers.
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
              Everything you need to know about BForms.
            </p>
          </div>

          <div className="mt-12">
            <Accordion className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is BForms free?</AccordionTrigger>
                <AccordionContent>
                  Yes! The free tier includes 5 forms and up to 100 submissions per month
                  with 7-day submission history. Perfect for personal projects and small
                  websites. Paid plans start at $5/month when you need more.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I add a form to my website?</AccordionTrigger>
                <AccordionContent>
                  Create a form endpoint in your dashboard, then set your HTML form&apos;s{" "}
                  <code>action</code> attribute to the BForms URL. That&apos;s it — no
                  JavaScript SDK or API keys needed on the client side.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What platforms does BForms work with?</AccordionTrigger>
                <AccordionContent>
                  BForms works with anything that can send an HTML form POST request:
                  WordPress, Webflow, Squarespace, Wix, Next.js, Astro, plain HTML, and
                  more. If it has a form tag, it works.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How does spam protection work?</AccordionTrigger>
                <AccordionContent>
                  We use honeypot fields — invisible form fields that trick bots into
                  filling them out. When a bot submission is detected, it&apos;s
                  automatically flagged and filtered from your inbox.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Your submission data is securely stored with encryption at rest. We
                  never share or sell your data to third parties. You can delete
                  submissions at any time from your dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  What happens when I hit my plan limits?
                </AccordionTrigger>
                <AccordionContent>
                  New submissions stop being accepted once your monthly quota is reached.
                  You can upgrade your plan at any time to increase your limits. No data
                  is ever lost — existing submissions remain accessible.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="bg-primary/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-secondary/30 absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Start collecting submissions today
          </h2>
          <p className="text-muted-foreground mt-6 text-lg md:text-xl">
            Set up your first form endpoint in under a minute. No credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/login" />}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link to="/pricing" />}
            >
              See Pricing
            </Button>
          </div>
          <div className="text-muted-foreground mt-8 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4" />
              Free forever tier
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4" />
              No credit card needed
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4" />
              Setup in 60 seconds
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} BForms. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/pricing"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Pricing
            </Link>
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

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-2xl border p-6 transition-shadow hover:shadow-md">
      <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-xl p-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-2xl border p-6 text-center">
      <div className="bg-primary text-primary-foreground mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <Check className="text-primary h-4 w-4 shrink-0" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}

function HighlightedCode() {
  const { data: html } = useSuspenseQuery(highlightedCodeQueryOptions());

  return (
    <div
      className="overflow-hidden rounded-b-xl text-sm leading-relaxed [&_pre]:overflow-x-auto [&_pre]:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

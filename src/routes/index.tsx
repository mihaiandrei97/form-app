import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import { Suspense } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "BForms - Form endpoints for your websites" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const scrollToExamples = () => {
    document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-svh">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold">
            BForms
          </Link>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              render={<Link to="/pricing" />}
            >
              Pricing
            </Button>
            <Suspense fallback={null}>
              <HeaderActions />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Form endpoints for your websites
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl">
            Add contact forms, feedback widgets, and more to any website. No backend
            required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/login" />}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToExamples}>
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Why BForms?</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            Everything you need to collect form submissions without writing backend code.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="No Backend Required"
              description="Create form endpoints in seconds. Just point your HTML form to our URL and start collecting submissions."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Spam Protection"
              description="Built-in honeypot fields automatically detect and filter bot submissions, keeping your inbox clean."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Domain Restrictions"
              description="Control exactly which websites can submit to your forms. Block unauthorized submissions with ease."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            Get started in minutes with three simple steps.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <StepCard
              number={1}
              title="Create a form"
              description="Sign up and create a form endpoint. Configure email notifications and customize settings."
            />
            <StepCard
              number={2}
              title="Add to your site"
              description="Copy the HTML snippet and paste it into your website. Works with any platform or website builder."
            />
            <StepCard
              number={3}
              title="Receive submissions"
              description="Get email notifications and view all submissions in your dashboard. It's that simple."
            />
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="bg-muted/50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold">Integration is Simple</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            Just add your BForms endpoint URL to any HTML form.
          </p>
          <div className="mt-12">
            <pre className="bg-card overflow-x-auto rounded-lg border p-6 text-sm">
              <code>{`<form action="https://bforms.dev/api/f/your-form-id" method="POST">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required />

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <button type="submit">Send Message</button>
</form>`}</code>
            </pre>
          </div>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Works with React, Vue, plain HTML, WordPress, Webflow, and any other platform.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center">
            Got questions? We&apos;ve got answers.
          </p>
          <div className="mt-12">
            <Accordion className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is BForms free?</AccordionTrigger>
                <AccordionContent>
                  Yes! BForms offers a generous free tier that includes unlimited forms
                  and up to 100 submissions per month. Perfect for personal projects and
                  small websites.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I add a form to my website?</AccordionTrigger>
                <AccordionContent>
                  Simply create a form in your dashboard, copy the HTML snippet, and paste
                  it into your website&apos;s HTML. It works with any website builder or
                  custom code.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Can I use BForms with any website builder?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely. BForms works with WordPress, Webflow, Squarespace, Wix,
                  static sites, and any platform that allows custom HTML forms.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How does spam protection work?</AccordionTrigger>
                <AccordionContent>
                  We use honeypot fields - invisible form fields that trick bots into
                  filling them out. When detected, submissions are automatically flagged
                  as spam and filtered from your inbox.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Where is my data stored?</AccordionTrigger>
                <AccordionContent>
                  Your submission data is securely stored in our database with encryption
                  at rest. We never share or sell your data to third parties. See our
                  Privacy Policy for more details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-4 text-lg opacity-90">
            Create your first form endpoint in under a minute.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
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

function HeaderActions() {
  const { data: user } = useSuspenseQuery(authQueryOptions());

  if (user) {
    return (
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link to="/dashboard" />}
      >
        Dashboard
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link to="/login" />}
      >
        Login
      </Button>
      <Button size="sm" nativeButton={false} render={<Link to="/login" />}>
        Get Started
      </Button>
    </>
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
    <div className="bg-card rounded-lg border p-6">
      <div className="bg-primary/10 text-primary mb-4 inline-flex rounded-lg p-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
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
    <div className="text-center">
      <div className="bg-primary text-primary-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
}

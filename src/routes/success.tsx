import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [{ title: "Success | BForms" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="min-h-svh">
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
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              render={<Link to="/" />}
            >
              Home
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="bg-muted/40 absolute inset-0" />
        <div className="bg-primary/10 absolute top-12 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-secondary/50 absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="bg-card/70 mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <CheckCircle2 className="text-primary h-4 w-4" />
            Your plan is active
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            You&apos;re all set
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg">
            Thanks for upgrading. Your new limits are available now.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/dashboard" />}>
              Go to dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link to="/pricing" />}
            >
              Review plans
            </Button>
          </div>
        </div>
      </section>

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

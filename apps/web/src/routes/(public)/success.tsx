import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/(public)/success")({
  head: () => ({
    meta: [{ title: "Success | BForms" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div className="bg-card mx-auto mb-6 inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 text-sm font-bold shadow-[var(--shadow-brutal)]">
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
  );
}

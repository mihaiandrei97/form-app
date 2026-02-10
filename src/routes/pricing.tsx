import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";
import { productsQueryOptions } from "~/lib/pricing/queries";

export const Route = createFileRoute("/pricing")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  head: () => ({
    meta: [{ title: "Pricing | BForms" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const navigate = useNavigate();
  const { data: plans } = useSuspenseQuery(productsQueryOptions());

  useEffect(() => {
    async function checkSubcription() {
      const { data } = await authClient.creem.hasAccessGranted();
      console.log(data);
      const session = await authClient.getSession();
      console.log("Current user session", session);
    }
    checkSubcription();
  }, []);

  const handlePlanClick = async (prodId: string, planName: string) => {
    console.log("Selected plan", prodId);

    // Free plan - navigate to dashboard
    if (planName === "Free") {
      navigate({ to: "/dashboard" });
      return;
    }

    // Paid plans - create checkout
    const session = await authClient.getSession();
    if (!session?.data?.user) {
      toast.error("You must be logged in to subscribe. Redirecting to login...");
      setTimeout(() => {
        // Navigate to login with redirect back to pricing
        navigate({
          to: "/login",
          search: { redirect: "/pricing" },
        });
      }, 2000);
      return;
    }

    const { error } = await authClient.creem.createCheckout({
      productId: prodId,
      successUrl: "/success",
      metadata: { referenceId: session.data.user.id },
    });
    if (error) {
      console.error("Error creating checkout", error);
      toast.error("Failed to create checkout session. Please try again.");
      return;
    }
  };

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

      <section className="relative overflow-hidden">
        <div className="bg-muted/40 absolute inset-0" />
        <div className="bg-primary/10 absolute top-12 -left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-secondary/50 absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <div className="bg-card/70 text-muted-foreground mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Transparent pricing that scales with you
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Pricing built for growth
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg md:text-xl">
            Start free, then unlock email notifications and automation when your forms
            take off.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.highlight
                    ? "bg-card border-primary/40 relative rounded-2xl border p-6 shadow-lg"
                    : "bg-card rounded-2xl border p-6"
                }
              >
                {plan.highlight ? (
                  <span className="bg-primary text-primary-foreground absolute top-6 right-6 rounded-full px-3 py-1 text-xs font-semibold">
                    Most popular
                  </span>
                ) : null}
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handlePlanClick(plan.prodId, plan.name)}
                >
                  {plan.cta}
                </Button>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="text-primary mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 text-center text-sm">
            Need higher limits or custom workflows? Reach out and we will work with you.
          </p>
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            What happens when you hit limits?
          </h2>
          <p className="text-muted-foreground mt-4 text-base md:text-lg">
            Submissions stop once your monthly quota is reached. Email notifications pause
            when you hit the Starter daily or monthly email cap.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/login" />}>
              Start free
            </Button>
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={<Link to="/login" />}
            >
              Compare plans
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

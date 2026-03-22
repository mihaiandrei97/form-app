import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth/auth-client";
import { authQueryOptions } from "~/lib/auth/queries";
import { productsQueryOptions } from "~/lib/pricing/queries";

export const Route = createFileRoute("/(public)/pricing")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQueryOptions()),
      context.queryClient.ensureQueryData(authQueryOptions()),
    ]),
  head: () => ({
    meta: [{ title: "Pricing | BForms" }],
  }),
  component: PricingPage,
});

function PricingPage() {
  const navigate = useNavigate();
  const { data: plans } = useSuspenseQuery(productsQueryOptions());
  const { data: userData } = useSuspenseQuery(authQueryOptions());
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentPlan = userData?.plan ?? "free";
  const isPaid = currentPlan === "starter" || currentPlan === "pro";

  const handleManageBilling = async () => {
    setLoadingPlan("portal");
    try {
      const { data, error } = await authClient.creem.createPortal();
      if (error) throw new Error(error.message);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to open billing portal");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePlanClick = async (prodId: string, planName: string) => {
    // Free plan - navigate to dashboard
    if (planName === "Free") {
      navigate({ to: "/dashboard" });
      return;
    }

    // If already on a paid plan, open billing portal to manage/switch
    if (isPaid) {
      await handleManageBilling();
      return;
    }

    // Paid plans - create checkout
    const session = await authClient.getSession();
    if (!session?.data?.user) {
      toast.error("You must be logged in to subscribe. Redirecting to login...");
      setTimeout(() => {
        navigate({
          to: "/login",
          search: { redirect: "/pricing" },
        });
      }, 2000);
      return;
    }

    setLoadingPlan(planName);
    try {
      const result = await authClient.creem.createCheckout({
        productId: prodId,
        successUrl: "/success",
        metadata: { referenceId: session.data.user.id },
      });
      if (result.data?.error || result.error) {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create checkout session. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getPlanCta = (planName: string, originalCta: string) => {
    if (planName === "Free") return originalCta;
    if (isPaid && currentPlan === planName.toLowerCase()) return "Manage Billing";
    if (isPaid) return "Change Plan";
    return originalCta;
  };

  return (
    <>
      <section className="bg-muted/40 border-b-2 border-foreground">
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <div className="bg-card text-muted-foreground mx-auto mb-6 inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 text-sm font-bold shadow-[var(--shadow-brutal)]">
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
                    ? "bg-card relative border-2 border-foreground p-6 shadow-[var(--shadow-brutal)]"
                    : "bg-card border-2 border-foreground p-6"
                }
              >
                {plan.highlight ? (
                  <span className="bg-primary text-primary-foreground absolute top-6 right-6 border-2 border-foreground px-3 py-1 text-xs font-bold">
                    Most popular
                  </span>
                ) : null}
                <h2 className="text-xl font-bold">{plan.name}</h2>
                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/ month</span>
                </div>
                <Button
                  className="mt-6 w-full gap-2"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handlePlanClick(plan.prodId, plan.name)}
                  disabled={loadingPlan !== null}
                >
                  {isPaid && plan.name !== "Free" ? (
                    <CreditCard className="h-4 w-4" />
                  ) : null}
                  {loadingPlan === plan.name || (loadingPlan === "portal" && plan.name !== "Free")
                    ? "Loading..."
                    : getPlanCta(plan.name, plan.cta)}
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

      <section className="bg-muted/40 border-y-2 border-foreground py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            What happens when you hit limits?
          </h2>
          <p className="text-muted-foreground mt-4 text-base md:text-lg">
            Submissions stop once your monthly quota is reached. Email notifications pause
            when you hit your plan's daily or monthly email cap.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link to="/login" />}>
              Start free
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

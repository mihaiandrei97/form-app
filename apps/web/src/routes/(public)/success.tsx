import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { $getFreshUser } from "~/lib/auth/functions";
import { authQueryOptions } from "~/lib/auth/queries";

export const Route = createFileRoute("/(public)/success")({
  head: () => ({
    meta: [{ title: "Success | BForms" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const refreshUser = async () => {
      const userQueryKey = authQueryOptions().queryKey;

      await queryClient.invalidateQueries({ queryKey: userQueryKey });

      for (let attempt = 0; attempt < 3 && !cancelled; attempt++) {
        const user = await $getFreshUser();
        queryClient.setQueryData(userQueryKey, user);

        if (user?.plan && user.plan !== "free") {
          return;
        }

        if (attempt < 2) {
          await new Promise((resolve) => {
            timeoutId = setTimeout(resolve, 1000);
          });
        }
      }
    };

    void refreshUser();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [queryClient]);

  return (
    <section className="py-16 md:py-24">
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <div className="bg-card border-foreground mx-auto mb-6 inline-flex items-center gap-2 border-2 px-4 py-2 text-sm font-bold shadow-[var(--shadow-brutal)]">
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

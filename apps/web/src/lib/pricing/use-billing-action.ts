import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import authClient from "~/lib/auth/auth-client";

/**
 * Returns a function that opens the Creem billing portal for paid users, or
 * navigates to /pricing for free users (who have no Creem customer ID yet).
 */
export function useBillingAction(plan: string = "free") {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openPortal = async () => {
    // Free users have no Creem customer ID — send them to the pricing page
    // to start a checkout instead.
    if (plan === "free") {
      router.navigate({ to: "/pricing" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.creem.createPortal();
      if (error) throw new Error(error.message);
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to open billing portal",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { openPortal, isLoading };
}

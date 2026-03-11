import { useState } from "react";
import { toast } from "sonner";
import authClient from "~/lib/auth/auth-client";

/**
 * Returns a function that opens the Creem billing portal and a loading flag.
 * Use this wherever an "Upgrade" or "Manage Billing" action is needed so the
 * user is always sent to the portal rather than a static pricing page.
 */
export function useBillingAction() {
  const [isLoading, setIsLoading] = useState(false);

  const openPortal = async () => {
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

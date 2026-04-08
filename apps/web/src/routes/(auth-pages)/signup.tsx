import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { GalleryVerticalEnd, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SignInSocialButton } from "~/components/sign-in-social-button";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import authClient from "~/lib/auth/auth-client";

export const Route = createFileRoute("/(auth-pages)/signup")({
  head: () => ({
    meta: [{ title: "Sign Up | BForms" }],
  }),
  component: SignupForm,
});

function SignupForm() {
  const { redirectUrl } = Route.useRouteContext();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const magicLinkMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: redirectUrl,
      });
      if (error) {
        throw new Error(error.message || "Failed to send magic link");
      }
    },
    onSuccess: () => {
      setMagicLinkSent(true);
      toast.success("Magic link sent! Check your email.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send magic link.");
    },
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mb-2 flex justify-center">
          <a href="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">BForms</span>
          </a>
        </div>
        <CardTitle className="text-xl">Sign up for BForms</CardTitle>
        <CardDescription>
          Create an account with a magic link or your social account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {magicLinkSent ? (
            <div className="text-center">
              <Mail className="mx-auto mb-2 size-8 opacity-60" />
              <p className="text-sm font-medium">Check your email</p>
              <p className="text-muted-foreground mt-1 text-xs">
                We sent a sign-in link to <strong>{email}</strong>
              </p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  setMagicLinkSent(false);
                  magicLinkMutation.reset();
                }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                magicLinkMutation.mutate();
              }}
              className="grid gap-3"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={
                  magicLinkMutation.isPending || !email
                }
              >
                <Mail className="size-4" />
                {magicLinkMutation.isPending
                  ? "Sending..."
                  : "Send magic link"}
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">or</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SignInSocialButton
              provider="github"
              callbackURL={redirectUrl}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
              }
            />
            <SignInSocialButton
              provider="google"
              callbackURL={redirectUrl}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

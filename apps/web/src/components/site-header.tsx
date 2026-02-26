import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { authQueryOptions } from "~/lib/auth/queries";

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

export function SiteHeader() {
  return (
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
            render={<Link to="/docs" />}
          >
            Docs
          </Button>
          <Suspense fallback={null}>
            <HeaderActions />
          </Suspense>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

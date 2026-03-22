import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Suspense, useState } from "react";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { authQueryOptions } from "~/lib/auth/queries";

function HeaderActions({
  onNav,
  mobile,
}: {
  onNav?: () => void;
  mobile?: boolean;
}) {
  const { data: user } = useSuspenseQuery(authQueryOptions());

  if (user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={mobile ? "w-full justify-start" : undefined}
        nativeButton={false}
        render={<Link to="/dashboard" onClick={onNav} />}
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
        className={mobile ? "w-full justify-start" : undefined}
        nativeButton={false}
        render={<Link to="/login" onClick={onNav} />}
      >
        Login
      </Button>
      <Button
        size="sm"
        className={mobile ? "w-full justify-start" : undefined}
        nativeButton={false}
        render={<Link to="/login" onClick={onNav} />}
      >
        Get Started
      </Button>
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-2 border-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          BForms
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
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

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="sm" aria-label="Open menu" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to="/"
                    className="text-xl font-bold"
                    onClick={() => setOpen(false)}
                  >
                    BForms
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2 px-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start"
                  nativeButton={false}
                  render={<Link to="/pricing" onClick={() => setOpen(false)} />}
                >
                  Pricing
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start"
                  nativeButton={false}
                  render={<Link to="/docs" onClick={() => setOpen(false)} />}
                >
                  Docs
                </Button>
                <div className="mt-2 flex flex-col gap-2">
                  <Suspense fallback={null}>
                    <HeaderActions onNav={() => setOpen(false)} mobile />
                  </Suspense>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

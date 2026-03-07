import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} BForms. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/pricing"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Pricing
          </Link>
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
  );
}

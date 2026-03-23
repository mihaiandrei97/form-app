import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { authMiddleware } from "~/lib/auth/middleware";

/**
 * Middleware that extends authMiddleware and additionally enforces
 * that the authenticated user has the "admin" role.
 */
export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (context.user.role !== "admin") {
      setResponseStatus(403);
      throw new Error("Forbidden");
    }

    return next({ context: { user: context.user } });
  });

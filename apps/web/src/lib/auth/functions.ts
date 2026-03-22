import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth/auth";

async function getUserFromSession(disableCookieCache: boolean = false) {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query: disableCookieCache ? { disableCookieCache: true } : undefined,
    returnHeaders: true,
  });

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  return session.response?.user || null;
}

export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  return getUserFromSession();
});

export const $getFreshUser = createServerFn({ method: "GET" }).handler(async () => {
  return getUserFromSession(true);
});

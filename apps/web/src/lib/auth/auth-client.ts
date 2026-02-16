import { createClient } from "@repo/auth/client";
import { env } from "@repo/env/web";

const authClient = createClient({
  baseURL: env.VITE_BASE_URL,
});

export default authClient;

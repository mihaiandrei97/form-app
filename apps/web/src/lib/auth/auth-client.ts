import { creemClient } from "@creem_io/better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@repo/env/web";

const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  plugins: [
    creemClient(),
    inferAdditionalFields({
      user: {
        plan: {
          type: "string",
        },
      },
    }),
  ],
});

export default authClient;

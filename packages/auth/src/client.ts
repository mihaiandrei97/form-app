import { creemClient } from "@creem_io/better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export type AuthClientConfig = {
  baseURL: string;
};

export const createClient = (config: AuthClientConfig) =>
  createAuthClient({
    baseURL: config.baseURL,
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

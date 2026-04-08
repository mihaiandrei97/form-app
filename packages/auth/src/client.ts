import { creemClient } from "@creem_io/better-auth/client";
import {
  inferAdditionalFields,
  adminClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export type AuthClientConfig = {
  baseURL: string;
};

export const createClient = (config: AuthClientConfig) =>
  createAuthClient({
    baseURL: config.baseURL,
    plugins: [
      adminClient(),
      creemClient(),
      magicLinkClient(),
      inferAdditionalFields({
        user: {
          plan: {
            type: "string",
          },
        },
      }),
    ],
  });

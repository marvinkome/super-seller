import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  skipValidation: process.argv.includes("lint"),
  server: {
    NOTION_API_SECRET: z.string().min(1),
    PAYSTACK_SECRET_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NOTION_API_SECRET: process.env.NOTION_API_SECRET,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  },
});

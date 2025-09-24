import { tool } from "@openai/agents";
import z from "zod";

import { createMessage } from "./telegram";

export const mailTool = tool({
  name: "mail tool",
  description: "Send important mail details via Telegram",
  parameters: z.object({
    details: z.string().describe("All important mail info"),
  }),
  execute: async ({ details }) => {
    console.log("Sending important mail...", details);
    await createMessage(details);
  },
});

export const nonImpMailTool = tool({
  name: "non imp mail tool",
  description: "Logs non-important mail details",
  parameters: z.object({
    details: z.string().describe("All non-important mail info"),
  }),
  execute: ({ details }) => {
    console.log("Non-important mail:", details);
  },
});

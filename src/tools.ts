import { tool } from "@openai/agents";
import z from "zod";

import { createMessage } from "./telegram";
import createCalendarEvent from "./utils/calendar.utils";

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

export const addCalendarEventTool = tool({
  name: "add to calendar",
  description: "Add important event to Google Calendar",
  parameters: z.object({
    summary: z.string().describe("Event title"),
    description: z
      .string()
      .describe("Event description, if any url exists, include that too"),
    location: z.string().describe("Event location"),
    start: z.string().datetime().describe("Event start time"),
    end: z.string().datetime().describe("Event end time"),
  }),
  execute: async ({ summary, description, location, start, end }) => {
    console.log("Adding event to calendar...", {
      summary,
      description,
      location,
      start,
      end,
    });
    await createCalendarEvent(summary, description, location, start, end);
  },
});

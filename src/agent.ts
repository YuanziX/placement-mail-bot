import { Agent, tool } from "@openai/agents";
import { z } from "zod";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config();

const token = process.env.TOKEN!;
const chatId = process.env.CHATID!;

const bot = new TelegramBot(token, {
  request: {
    agentOptions: {
      keepAlive: true,
      family: 4,
    },
    url: "https://api.telegram.org",
  },
});

async function createMessage(details: string) {
  try {
    await bot.sendMessage(chatId, details);
  } catch (error) {
    throw error;
  }
}

const mailTool = tool({
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

const nonImpMailTool = tool({
  name: "non imp mail tool",
  description: "Logs non-important mail details",
  parameters: z.object({
    details: z.string().describe("All non-important mail info"),
  }),
  execute: ({ details }) => {
    console.log("Non-important mail:", details);
  },
});

const mailAgent = new Agent({
  name: "Mail Checker Agent",
  model: "gpt-4.1-mini",
  instructions: `
        You will be given the content of an email. 
        If the mail is related to placement, send a Telegram message using the "mail tool" 
        only mails with placement data are considered as important mails
        share with important details like venue, CTC, company, event, and eligibility to mail tool
        Otherwise, use the "non imp mail tool".
        Always use only one tool.
    `,
  tools: [mailTool, nonImpMailTool],
});

export default mailAgent;

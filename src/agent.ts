import { Agent } from "@openai/agents";
import { google } from "@ai-sdk/google";
import { aisdk } from "@openai/agents-extensions";
import { mailTool, nonImpMailTool } from "./tools";

const geminiModel = aisdk(google("gemini-2.5-flash"));

const mailAgent = new Agent({
  name: "Mail Checker Agent",
  model: geminiModel,
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

import { Agent } from "@openai/agents";
import { groq } from "@ai-sdk/groq";
import { aisdk } from "@openai/agents-extensions";
import { addCalendarEventTool, mailTool, nonImpMailTool } from "./tools";

const groqModel = aisdk(groq("llama-3.1-8b-instant"));

const mailAgent = new Agent({
  name: "Mail Checker Agent",
  model: groqModel,
  instructions: `instructions: You are given the content of an email. Follow these rules strictly:

- If the email is related to placement:
  • Extract details (venue, CTC, company, event, eligibility).
  • Always call the mailTool with these details.
  • If hasRegNumber is true, also call addCalendarEventTool with the same details.

- If the email is NOT related to placement:
  • Call nonImpMailTool.

Return ONLY tool calls. Do not return any extra text.
`,
  tools: [mailTool, nonImpMailTool, addCalendarEventTool],
});

export default mailAgent;

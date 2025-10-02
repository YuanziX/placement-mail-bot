import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, calendar_v3 } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

let client: calendar_v3.Calendar | undefined = undefined;

async function getClient(): Promise<calendar_v3.Calendar> {
  if (client) {
    return client;
  }

  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  client = google.calendar({ version: "v3", auth });
  return client;
}

async function createCalendarEvent(
  summary: string,
  description: string,
  location: string,
  start: string,
  end: string
): Promise<calendar_v3.Schema$Event | undefined> {
  const localClient = await getClient();

  const event: calendar_v3.Schema$Event = {
    summary,
    description,
    location,
    start: { dateTime: start, timeZone: "Asia/Kolkata" },
    end: { dateTime: end, timeZone: "Asia/Kolkata" },
  };

  try {
    const response = await localClient.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

export default createCalendarEvent;

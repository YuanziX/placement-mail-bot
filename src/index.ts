import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import mailAgent from "./agent";
import { run } from "@openai/agents";
import { IGNORE_MAILS_FROM_ADDRS } from "./constants";

dotenv.config();

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000,
  },
};

async function readRecentEmails() {
  try {
    console.log("securing connection ");
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const searchCriteria = ["UNSEEN", ["SINCE", fiveMinutesAgo]];
    const fetchOptions = { bodies: [""] };
    console.log("getting mails");
    const messages = await connection.search(searchCriteria, fetchOptions);
    console.log("got mails", messages.length);

    for (const item of messages) {
      const all = item.parts.find((part) => part.which === "");
      const parsed = await simpleParser(all.body);

      if (
        IGNORE_MAILS_FROM_ADDRS.includes(
          (parsed.from["value"][0]["address"] as string).toLowerCase()
        )
      ) {
        console.log("Ignoring mail from:", parsed.from["value"][0]["address"]);
        continue;
      }

      if (parsed.date && parsed.date > fiveMinutesAgo) {
        const mailData = {
          subject: parsed.subject,
          from: parsed.from?.text,
          text: parsed.text,
          date: parsed.date,
          hasRegNumber: false,
        };

        if (parsed.attachments && parsed.attachments.length > 0) {
          // check if excel sheet is here
          const excelAttachment = parsed.attachments.find((attachment) =>
            attachment.contentType.includes("spreadsheet")
          );
          if (excelAttachment) {
            // parse and check for USER_REGISTRATION_NUMBER
            if (
              process.env.USER_REGISTRATION_NUMBER &&
              parsed.text.includes(process.env.USER_REGISTRATION_NUMBER)
            ) {
              mailData["hasRegNumber"] = true;
            }
          }
        }

        await run(
          mailAgent,
          `This is the mail data: ${JSON.stringify(mailData)}`
        );
      }
    }

    connection.end();
  } catch (err) {
    console.error(err);
  }
}

setInterval(readRecentEmails, 5 * 60 * 1000);

readRecentEmails();

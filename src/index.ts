import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";
import mailAgent from "./agent";
import { run } from "@openai/agents";
import { IGNORE_MAILS_FROM_ADDRS } from "./constants";
import * as XLSX from "xlsx";

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
    const connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const searchCriteria = ["UNSEEN", ["SINCE", fiveMinutesAgo]];
    const fetchOptions = { bodies: [""] };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
      const all = item.parts.find((part) => part.which === "");
      const parsed = await simpleParser(all.body);

      const senderAddress = (
        parsed.from["value"][0]["address"] as string
      ).toLowerCase();

      if (IGNORE_MAILS_FROM_ADDRS.includes(senderAddress)) {
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
          const excelAttachment = parsed.attachments.find((attachment) =>
            [
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel",
            ].includes(attachment.contentType)
          );

          if (excelAttachment) {
            try {
              const workbook = XLSX.read(excelAttachment.content, {
                cellText: false,
                cellDates: false,
              });

              if (workbook.SheetNames.length > 0) {
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet, {
                  header: 1,
                  raw: false,
                  defval: "",
                });

                const hasRegNumber = data.some((row) => {
                  return (
                    Array.isArray(row) &&
                    row.some((cell) => {
                      const cellStr = String(cell);
                      return cellStr.includes(
                        process.env.USER_REGISTRATION_NUMBER || ""
                      );
                    })
                  );
                });
                mailData.hasRegNumber = hasRegNumber;
              }
            } catch (xlsxError) {
              mailData.hasRegNumber = false;
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
    console.error("Error in readRecentEmails:", err);
  }
}

setInterval(readRecentEmails, 5 * 60 * 1000);
readRecentEmails();

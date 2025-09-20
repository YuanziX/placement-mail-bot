import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import mailAgent from './agent';
import { run } from '@openai/agents';

dotenv.config();

const config = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 3000
    }
};

async function readRecentEmails() {
    try {
        console.log("securing connection ")
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const searchCriteria = ['UNSEEN', ['SINCE', fiveMinutesAgo]];
        const fetchOptions = { bodies: [''] };
        console.log("getting mails")
        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log("got mails")

        for (const item of messages) {
            const all = item.parts.find(part => part.which === '');
            const parsed = await simpleParser(all.body);


            if (parsed.date && parsed.date > fiveMinutesAgo) {
                const mailData = {
                    subject: parsed.subject,
                    from: parsed.from?.text,
                    text: parsed.text,
                    date: parsed.date
                };
                await run(mailAgent, `This is the mail data: ${JSON.stringify(mailData)}`);
            }
        }

        connection.end();
    } catch (err) {
        console.error(err);
    }
}

setInterval(readRecentEmails, 5 * 60 * 1000);


readRecentEmails();

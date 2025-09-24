import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

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

export async function createMessage(details: string) {
  try {
    await bot.sendMessage(chatId, details);
  } catch (error) {
    throw error;
  }
}

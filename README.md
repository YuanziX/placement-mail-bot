# Mail Bot - Placement Email Notification System

A smart email monitoring bot that checks your inbox every 5 minutes for placement-related emails and sends instant Telegram notifications. Built with OpenAI agents for intelligent email classification and automated responses.

## 🚀 Features

- **Automated Email Monitoring**: Checks emails every 5 minutes
- **Smart Classification**: Uses OpenAI agents to identify placement-related content
- **Instant Notifications**: Sends Telegram messages for important emails
- **Docker Support**: Easy deployment with pre-built Docker image
- **Secure**: Environment variable configuration for sensitive data

## 📋 Prerequisites

Before running the bot, you'll need:

1. **Telegram Bot Token** - Create a bot using [@BotFather](https://t.me/botfather)
2. **Telegram Chat ID** - Get your chat ID to receive messages
3. **OpenAI API Key** - For intelligent email processing
4. **Email Credentials** - Gmail account with app password enabled

## 🛠️ Setup Instructions

### Step 1: Get Telegram Bot Token

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the bot token provided

### Step 2: Get Your Chat ID

1. Start a chat with your bot
2. Send any message to your bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for your chat ID in the response

### Step 3: Setup Email App Password (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Navigate to Security → App passwords
4. Generate an app password for "Mail"
5. Use this password (not your regular Gmail password)

### Step 4: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key

## 🐳 Docker Usage

### Pull and Run the Docker Image

```bash
docker pull subhadeepthandaka/mail-bot:latest

docker run -d \
  --name mail-bot \
  -e OPENAI_API_KEY="your_openai_api_key" \
  -e TOKEN="your_telegram_bot_token" \
  -e CHATID="your_telegram_chat_id" \
  -e EMAIL_USER="your_email@gmail.com" \
  -e EMAIL_PASS="your_app_password" \
  --restart unless-stopped \
  subhadeepthandaka/mail-bot:latest
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3.8"
services:
  mail-bot:
    image: subhadeepthandaka/mail-bot:latest
    container_name: mail-bot
    environment:
      - OPENAI_API_KEY=your_openai_api_key
      - TOKEN=your_telegram_bot_token
      - CHATID=your_telegram_chat_id
      - EMAIL_USER=your_email@gmail.com
      - EMAIL_PASS=your_app_password
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## ⚙️ Environment Variables

| Variable         | Description                                          | Required |
| ---------------- | ---------------------------------------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key for intelligent email processing | ✅       |
| `TOKEN`          | Telegram bot token from BotFather                    | ✅       |
| `CHATID`         | Your Telegram chat ID to receive notifications       | ✅       |
| `EMAIL_USER`     | Your email address (Gmail recommended)               | ✅       |
| `EMAIL_PASS`     | Email app password (not regular password)            | ✅       |

## 📱 How It Works

1. **Email Monitoring**: The bot connects to your email account using IMAP
2. **Intelligent Processing**: OpenAI agents analyze email content for placement-related keywords
3. **Smart Filtering**: Only relevant emails trigger notifications
4. **Instant Alerts**: Filtered emails are sent to your Telegram chat
5. **Continuous Operation**: Process repeats every 5 minutes

## 🔍 Placement Keywords Detected

The bot intelligently identifies emails related to:

- Job placements
- Interview invitations
- Recruitment updates
- Campus placement notifications
- HR communications
- Company hiring updates

## 🛡️ Security Notes

- Never commit API keys or passwords to version control
- Use environment variables for all sensitive data
- Enable 2FA on all accounts
- Use app passwords instead of regular email passwords
- Regularly rotate API keys and tokens

## 📊 Monitoring

To check if your bot is running:

```bash
# Check container status
docker ps | grep mail-bot

# View logs
docker logs mail-bot

# Follow logs in real-time
docker logs -f mail-bot
```

## 🔧 Troubleshooting

### Common Issues

**Bot not receiving emails:**

- Verify email credentials
- Check if 2FA and app password are set up correctly
- Ensure IMAP is enabled in Gmail settings

**No Telegram notifications:**

- Verify bot token and chat ID
- Make sure you've started a chat with the bot
- Check if the bot has permission to send messages

**OpenAI errors:**

- Verify API key is valid and has credits
- Check OpenAI service status
- Monitor rate limits

### Debug Commands

```bash
# Check container logs
docker logs mail-bot

# Access container shell
docker exec -it mail-bot /bin/bash

# Restart the container
docker restart mail-bot
```

## 📝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

If you encounter any issues or need help:

1. Check the troubleshooting section
2. Review container logs
3. Create an issue on GitHub
4. Ensure all environment variables are correctly set

---

**Made with ❤️ for placement notifications**

_Stay updated on your placement opportunities without constantly checking emails!_

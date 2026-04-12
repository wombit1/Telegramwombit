const TelegramBot = require('node-telegram-bot-api');

// TOKEN: Buradaki tırnak işaretlerini asla silme!
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; 

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `🌍 **Welcome to Wombit Unity!**\n\nHere; game, token, and awareness unite as one.\n\n🎮 **Play Tap Tap:** Have fun and discover Wombats.\n🚀 **Begin your journey now!**`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 Play Wombit Game", web_app: { url: "https://wombit1.github.io/Telegramwombit/" } }],
        [{ text: "🐦 Twitter", url: "https://x.com/wombat_io" }, { text: "📢 Announcements", url: "https://t.me/wombit_io_io" }],
        [{ text: "💬 Global Chat", url: "https://t.me/wombit_io" }, { text: "🎵 TikTok", url: "https://tiktok.com/@wombat_io" }]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

console.log("Bot basariyla baslatildi...");

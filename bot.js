const TelegramBot = require('node-telegram-bot-api');

// BURAYA KENDİ TOKEN'INI YAPIŞTIR
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; 

const bot = new TelegramBot(token, {polling: true});

const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `🌍 **Wombit Unity Dashboard**\n\n` +
    `The Wombit Empire is rising on Solana. Play, track, and join the herd.\n\n` +
    `📜 **CA:** \`${contractAddress}\` (Tap to copy)\n\n` +
    `🎮 **Play Tap Tap:** Start earning your glory.`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 Play Wombit Game", web_app: { url: "https://wombit1.github.io/Telegramwombit/" } }],
        [
          { text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` },
          { text: "📈 Live Chart", url: "https://gmgn.ai/sol/token/BxBuSTek_3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS" }
        ],
        [
          { text: "🌐 Website", url: "https://wombit.fun" },
          { text: "𝕏 Twitter", url: "https://x.com/wombat_io" }
        ],
        [
          { text: "🎵 TikTok", url: "https://tiktok.com/@wombat_io" },
          { text: "📢 Announcements", url: "https://t.me/wombit_io_io" }
        ],
        [{ text: "💬 Global Chat", url: "https://t.me/wombit_io" }]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

console.log("Wombit Dashboard TikTok ve yeni ikonlarla guncellendi!");

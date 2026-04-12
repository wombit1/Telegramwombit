const TelegramBot = require('node-telegram-bot-api');

// TOKEN: Buradaki tırnak işaretlerini asla silme!
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; // Token'ını kontrol etmeyi unutma!

const bot = new TelegramBot(token, {polling: true});

// Senin verdiğin gerçek CA
const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `🌍 **Welcome to Wombit Unity!**\n\n` +
    `The Wombit Empire is rising on Solana. Play the game, track the chart, and secure your place in the herd.\n\n` +
    `📜 **Contract Address (CA):**\n\`${contractAddress}\` (Click to copy)\n\n` +
    `🎮 **Play Tap Tap:** Have fun and earn your glory.`;

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
          { text: "🐦 Twitter", url: "https://x.com/wombat_io" }
        ],
        [
          { text: "📢 Announcements", url: "https://t.me/wombit_io_io" },
          { text: "💬 Global Chat", url: "https://t.me/wombit_io" }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

console.log("Wombit Unity Dashboard Live Chart ile guncellendi!");

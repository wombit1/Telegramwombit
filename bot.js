const TelegramBot = require('node-telegram-bot-api');

// --- AYARLAR ---
// BotFather'dan aldığın Token'ı buraya yapıştır
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; 
const bot = new TelegramBot(token, {polling: true});

// Sözleşme Adresin
const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 

// GitHub'a yüklediğin HD Yanardağlı görselin RAW linkini buraya yapıştır
const imageUrl = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/wombit_volcano.png"; 

// --- START KOMUTU (DASHBOARD) ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name; // Kullanıcının adını çeker
  
  const welcomeMessage = `👑 **The Empire Awaits You, ${firstName}!**\n\n` +
    `Rising from the volcanic fires of Solana. Wombit has taken the throne. Join the sacred herd and claim your glory!\n\n` +
    `📜 **CA:**\n\`${contractAddress}\`\n(Tap to copy address)\n\n` +
    `🎮 **Tap Tap:** Start earning your glory.`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 Play Wombit Game", web_app: { url: "https://wombit1.github.io/Telegramwombit/" } }],
        [
          { text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` },
          { text: "📈 Live Chart", url: `https://gmgn.ai/sol/token/${contractAddress}` }
        ],
        [
          { text: "🌐 Website", url: "https://wombit.fun" },
          { text: "𝕏 Twitter", url: "https://x.com/wombat_io" }
        ],
        [
          { text: "📢 Announcements", url: "https://t.me/wombit_io_io" },
          { text: "💬 Global Chat", url: "https://t.me/wombit_io" }
        ]
      ]
    }
  };

  // Resmi gönder, altına kopyalanabilir CA'lı metni ve butonları ekle
  bot.sendPhoto(chatId, imageUrl, { caption: welcomeMessage, ...options });
});

console.log("Wombit İmparatorluğu HD Dashboard yayında! 🌋");

const TelegramBot = require('node-telegram-bot-api');

// --- AYARLAR ---
// LÜTFEN: Tırnak içine BotFather'dan aldığın TAM token'ı yapıştır.
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; 
const bot = new TelegramBot(token, {polling: true});

const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 

// GitHub'daki resmine git, resme sağ tıkla ve "Resim adresini kopyala" diyerek buraya yapıştır.
const imageUrl = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/BCO.png"; 

// --- START KOMUTU ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || "Warrior"; 
  
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

  // Hata yönetimi ekledim (Resim yüklenmezse sadece metin gönderir)
  bot.sendPhoto(chatId, imageUrl, { caption: welcomeMessage, ...options })
    .catch((
      

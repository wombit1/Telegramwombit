const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// --- 1. RENDER CANLI TUTMA SİSTEMİ ---
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Wombit Empire is Live!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor...`);
});

// --- 2. AYARLAR VE TOKEN ---
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; // <-- Kendi token'ını buraya eksiksiz yapıştır!
const bot = new TelegramBot(token, { polling: true });

const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 
const dashboardImage = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/dashboard.png"; 
const gameUrl = "https://wombit1.github.io/Telegramwombit/";

// --- 3. TASARIM VE BUTONLAR (Eski Haline Döndürüldü) ---
const commonOptions = {
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [
      [{ text: "🎮 Play Wombit Game", web_app: { url: gameUrl } }],
      [
        { text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` },
        { text: "📈 Live Chart", url: "https://dexscreener.com/solana/" + contractAddress }
      ],
      [
        { text: "🌐 Website", url: "https://wombit.fun" },
        { text: "𝕏 Twitter", url: "https://x.com/wombit" } 
      ],
      [
        { text: "🎵 TikTok", url: "https://tiktok.com/@wombit" },
        { text: "📢 Announcements", url: "https://t.me/wombitann" }
      ],
      [{ text: "💬 Global Chat", url: "https://t.me/wombitchat" }]
    ]
  }
};

// --- 4. KOMUTLAR ---
bot.onText(/\/(start|game)/, (msg) => {
  const text = `🌍 **Wombit Unity Dashboard**\n\nThe Wombit Empire is rising on Solana.\nPlay, track, and join the herd.\n\n📜 **CA:** \`${contractAddress}\` (Tap to copy)\n\n🎮 **Play Tap Tap:** Start earning your glory.`;
  bot.sendPhoto(msg.chat.id, dashboardImage, { caption: text, ...commonOptions });
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "❓ **Destek Hattı**\n\nOyun hakkında bilgi almak ve sorunları bildirmek için topluluğumuza katılın.", commonOptions);
});

bot.on('polling_error', (err) => console.log("Hata:", err.code));

console.log("Wombit İmparatorluğu Eski İhtişamıyla Geri Döndü! 🌋");
  

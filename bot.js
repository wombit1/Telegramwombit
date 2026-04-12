const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// --- 1. RENDER İÇİN KRİTİK PORT BAĞLANTISI ---
// Render'ın 'Hizmet bulamadım' diyerek botu kapatmasını %100 engelleyen kısım
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Wombit Bot is Alive and Running!\n');
});

// Render'ın bize atadığı portu veya varsayılan 3000'i kullan
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor...`);
});

// --- 2. AYAR MERKEZİ ---
const token = '8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; // <-- Buraya token'ını yapıştır
const bot = new TelegramBot(token, { polling: true });

const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 
const dashboardImage = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/dashboard.png"; 
const gameUrl = "https://wombit1.github.io/Telegramwombit/";

// --- 3. KOMUTLAR ---

// Ortak Menü Butonları
const commonOptions = {
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [
      [{ text: "🎮 Play Wombit Game", web_app: { url: gameUrl } }],
      [{ text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` }],
      [{ text: "🌐 Website", url: "https://wombit.fun" }]
    ]
  }
};

// Start & Game Komutu
bot.onText(/\/(start|game)/, (msg) => {
  const text = `👑 **The Empire Awaits!**\n\nWombit has taken the throne on Solana.\n\n📜 **CA:**\n\`${contractAddress}\``;
  bot.sendPhoto(msg.chat.id, dashboardImage, { caption: text, ...commonOptions });
});

// Help Komutu
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, "❓ **Nasıl Oynanır?**\n\n1. Play butonuna bas.\n2. Ekrana dokunarak puan kazan.\n3. Arkadaşlarını davet et!", { parse_mode: 'Markdown' });
});

// About Komutu
bot.onText(/\/about/, (msg) => {
  bot.sendMessage(msg.chat.id, "🌋 **Wombit Hakkında**\n\nSolana tabanlı topluluk projesidir.", { parse_mode: 'Markdown' });
});

// Hata Yönetimi
bot.on('polling_error', (err) => console.log("Bot Hatası:", err.code));

console.log("Wombit İmparatorluğu Kesintisiz Modda! 🌋");
        

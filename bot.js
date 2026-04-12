const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// --- 1. RENDER'I UYANIK TUTMA SİSTEMİ (SAHTE SUNUCU) ---
// Bu kısım Render'ın "Port bulunamadı" hatasını engeller.
http.createServer((req, res) => {
  res.write('Wombit Empire is Alive!');
  res.end();
}).listen(process.env.PORT || 3000);

// --- 2. AYAR MERKEZİ ---
const token = '
8674387340:AAEB9ZNDVu-q3cY9EiaDsGrsS8bxuuS9P7U'; // Token'ını buraya yapıştır
const bot = new TelegramBot(token, {polling: true});

const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS"; 
const dashboardImage = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/dashboard.png"; 
const gameUrl = "https://wombit1.github.io/Telegramwombit/";

// --- 3. KOMUTLAR VE CEVAPLAR ---

// [START & GAME] - İmparatorluk Dashboard'unu Gönderir
bot.onText(/\/(start|game)/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  
  const welcomeMessage = `👑 **The Empire Awaits You, ${firstName}!**\n\n` +
    `Rising from the volcanic fires of Solana. Wombit has taken the throne.\n\n` +
    `📜 **CA:**\n\`${contractAddress}\`\n\n` +
    `🎮 **Tap Tap:** Start earning your glory.`;

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 Play Wombit Game", web_app: { url: gameUrl } }],
        [
          { text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` },
          { text: "📈 Live Chart", url: `https://gmgn.ai/sol/token/${contractAddress}` }
        ],
        [{ text: "🌐 Website", url: "https://wombit.fun" }]
      ]
    }
  };

  bot.sendPhoto(chatId, dashboardImage, { caption: welcomeMessage, ...options });
});

// [HELP] - Nasıl Oynanır?
bot.onText(/\/help/, (msg) => {
  const helpText = `❓ **Wombit İmparatorluğu'na Hoş Geldin!**\n\n` +
    `1️⃣ **Tıkla & Kazan:** 'Play' butonuna bas ve Wombit'e dokun.\n` +
    `2️⃣ **Geliş:** Puanlarla imparatorluğunu büyüt.\n` +
    `3️⃣ **Referans:** Arkadaşlarını davet et, orduyu kur!\n\n` +
    `🚀 **Hedef:** Gerçek $WOMBIT ödüllerine ulaşmak!`;
  bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'Markdown' });
});

// [ABOUT] - Proje Nedir?
bot.onText(/\/about/, (msg) => {
  const aboutText = `🌋 **Wombit Hakkında**\n\n` +
    `Wombit, Solana dağlarının en güçlü lideridir. Bu proje topluluk gücüyle büyüyen dev bir Web3 ekosistemidir.\n\n` +
    `🔗 [Twitter/X](https://x.com/wombat_io)`;
  bot.sendMessage(msg.chat.id, aboutText, { parse_mode: 'Markdown', disable_web_page_preview: true });
});

// [SETTINGS] - Ayarlar
bot.onText(/\/settings/, (msg) => {
  bot.sendMessage(msg.chat.id, "⚙️ **Ayarlar**\n\n- Dil: Türkçe / English (Yakında)\n- Cüzdan Bağlantısı (Yakında)", { parse_mode: 'Markdown' });
});

// Hata yönetimi
bot.on('polling_error', (error) => console.log("Hata:", error.code));

console.log("Wombit İmparatorluğu 7/24 Nöbete Başladı! 🌋");
      

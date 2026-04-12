const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════
// WOMBIT EMPIRE BOT v2.0 — SECURE & PRODUCTION READY
// ═══════════════════════════════════════════════════════════════

// --- 1. TOKEN GÜVENLİĞİ ---
// Token artık .env dosyasından okunuyor, kodda açık değil!
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('❌ HATA: BOT_TOKEN environment variable tanımlı değil!');
  console.error('   Render.com → Settings → Environment Variables bölümüne BOT_TOKEN ekle.');
  process.exit(1);
}

// --- 2. RENDER CANLI TUTMA SİSTEMİ ---
const server = http.createServer((req, res) => {
  // Telegram Webhook endpoint'i
  if (req.method === 'POST' && req.url === `/bot${token}`) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        bot.processUpdate(update);
      } catch (e) {
        console.error('Webhook parse hatası:', e);
      }
      res.writeHead(200);
      res.end('OK');
    });
    return;
  }

  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', bot: 'WOMBIT Empire', uptime: process.uptime() }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Wombit Empire is Live! 🌋\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Sunucu ${PORT} portunda dinleniyor...`);
});

// --- 3. BOT BAŞLATMA (Webhook modu — Polling yerine) ---
// Polling yerine Webhook kullanıyoruz: daha stabil, daha az kaynak tüketir
const RENDER_URL = process.env.RENDER_URL; // örn: https://wombit-bot.onrender.com

const bot = new TelegramBot(token, {
  webHook: false // Manuel webhook yönetimi yapıyoruz
});

// Webhook'u ayarla (Render URL varsa)
if (RENDER_URL) {
  bot.setWebHook(`${RENDER_URL}/bot${token}`)
    .then(() => console.log(`✅ Webhook ayarlandı: ${RENDER_URL}/bot${token}`))
    .catch(err => console.error('❌ Webhook ayarlanamadı:', err.message));
} else {
  // Lokal geliştirme için polling kullan
  console.log('ℹ️  RENDER_URL tanımlı değil, polling modunda başlatılıyor (lokal geliştirme)...');
  bot.startPolling();
}

// --- 4. SABITLER ---
const contractAddress = "3fzFmWRedsjuybCgic1rkkZAdKhzeHVvxs7sGBgrBAGS";
const dashboardImage = "https://raw.githubusercontent.com/wombit1/Telegramwombit/main/dashboard.png";
const gameUrl = "https://wombit1.github.io/Telegramwombit/";

// --- 5. initData DOĞRULAMA FONKSİYONU ---
// Telegram'ın imzasını kontrol ederek sahte veri gelip gelmediğini anlarız
function validateInitData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    if (!hash) return false;

    params.delete('hash');

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(token)
      .digest();

    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hash === expectedHash;
  } catch (e) {
    console.error('initData doğrulama hatası:', e);
    return false;
  }
}

// --- 6. ORTAK BUTON YAPISI ---
const getCommonOptions = (extraOptions = {}) => ({
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [
      [{ text: "🎮 Play Wombit Game", web_app: { url: gameUrl } }],
      [
        { text: "💎 Buy $WOMBIT", url: `https://jup.ag/swap/SOL-${contractAddress}` },
        { text: "📈 Live Chart", url: `https://dexscreener.com/solana/${contractAddress}` }
      ],
      [
        { text: "🌐 Website", url: "https://wombit.fun" },
        { text: "𝕏 Twitter", url: "https://x.com/wombat_io" }
      ],
      [
        { text: "🎵 TikTok", url: "https://tiktok.com/@wombat_io" },
        { text: "📢 Announcements", url: "https://t.me/wombitioio" }
      ],
      [{ text: "💬 Community Chat", url: "https://t.me/wombit_io" }]
    ]
  },
  ...extraOptions
});

// --- 7. KOMUTLAR ---

// /start ve /game komutu
bot.onText(/\/(start|game)/, (msg) => {
  const firstName = msg.from?.first_name || 'Wombat Warrior';
  const text =
    `Welcome, *${firstName}*! 👑\n\n` +
`The Wombit Empire is rising on Solana.\n` +
`Play, track, and join the herd.\n\n` +
    `📜 *CA:* \`${contractAddress}\`\n` +
    `_(Kopyalamak için dokun)_\n\n` +
    `🎮 *Play Tap Tap:* Şanını kazanmaya başla!`;

  bot.sendPhoto(msg.chat.id, dashboardImage, {
    caption: text,
    ...getCommonOptions()
  }).catch(err => {
    // Fotoğraf gönderilemezse metin olarak gönder
    console.error('Fotoğraf gönderilemedi:', err.message);
    bot.sendMessage(msg.chat.id, text, getCommonOptions());
  });
});

// /help komutu
bot.onText(/\/help/, (msg) => {
  const text =
    `❓ *Yardım Merkezi*\n\n` +
    `*Nasıl oynayabilirim?*\n` +
    `→ "Play Wombit Game" butonuna bas\n\n` +
    `*$WOMBIT nedir?*\n` +
    `→ Solana üzerindeki memecoin token'ımız\n\n` +
    `*Sorun mu yaşıyorsun?*\n` +
    `→ Topluluğumuza katıl: @wombit_io`;

  bot.sendMessage(msg.chat.id, text, getCommonOptions());
});

// /ca komutu — Contract address hızlı erişim
bot.onText(/\/ca/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `📜 *WOMBIT Contract Address*\n\n\`${contractAddress}\`\n\n_Kopyalamak için adrese dokun_`,
    { parse_mode: 'Markdown' }
  );
});

// --- 8. MİNİ APP VERİ ALICI ---
// Mini App'ten gelen verileri işle (tap sayısı, rank, vb.)
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const rawData = msg.web_app_data?.data;

  if (!rawData) {
    console.warn('web_app_data boş geldi');
    return;
  }

  try {
    const data = JSON.parse(rawData);
    console.log(`📊 Mini App verisi alındı [${chatId}]:`, data);

    // Veri tipine göre işlem yap
    switch (data.type) {
      case 'tap_milestone':
        bot.sendMessage(
          chatId,
          `🎉 *Tebrikler!*\n\n` +
          `*${data.taps?.toLocaleString()}* tap yaptın!\n` +
          `Rütben: *${data.rank || 'Recruit'}*\n\n` +
          `Oynamaya devam et! 💪`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'rank_up':
        bot.sendMessage(
          chatId,
          `👑 *RANK ATLADI!*\n\n` +
          `Yeni rütben: *${data.newRank}*\n` +
          `Toplam tap: *${data.taps?.toLocaleString()}*\n\n` +
          `İmparatorluğun büyüyor! 🚀`,
          { parse_mode: 'Markdown' }
        );
        break;

      case 'game_state':
        // Oyun durumu kaydı (gelecekte backend entegrasyonu için)
        console.log(`Oyun durumu kaydedildi: userId=${data.userId}, taps=${data.taps}`);
        break;

      default:
        console.log('Bilinmeyen veri tipi:', data.type);
    }
  } catch (e) {
    console.error('web_app_data parse hatası:', e.message, '| Raw:', rawData);
  }
});

// --- 9. HATA YÖNETİMİ ---
bot.on('polling_error', (err) => {
  console.error('Polling hatası:', err.code, err.message);
});

bot.on('webhook_error', (err) => {
  console.error('Webhook hatası:', err.code, err.message);
});

// Beklenmeyen hataları yakala, bot çökmüyor
process.on('uncaughtException', (err) => {
  console.error('Kritik hata (uncaughtException):', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Yakalanmamış Promise hatası:', reason);
});

console.log("🌋 Wombit İmparatorluğu Eski İhtişamıyla Geri Döndü!");
      

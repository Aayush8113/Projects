const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("🟡 Starting Free WhatsApp Engine...");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
  console.log('\n=========================================');
  console.log('📱 SCAN THIS QR CODE WITH YOUR WHATSAPP TO LINK THE BOT!');
  console.log('=========================================\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ FREE WHATSAPP BOT IS ONLINE AND READY TO SEND MESSAGES!');
});

client.on('disconnected', (reason) => {
  console.log('❌ WhatsApp Bot Disconnected:', reason);
});

client.initialize();

module.exports = client;
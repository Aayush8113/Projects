const cron = require('node-cron');
const Book = require('../models/Book');
const whatsappClient = require('./whatsappBot'); 

const startCronJobs = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('🔄 Checking for due dates to send WhatsApp alerts...');
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    try {
      const booksDueSoon = await Book.find({
        status: 'With Friends',
        dueDate: { $gte: startOfDay, $lte: endOfDay },
        borrowerPhone: { $ne: null, $ne: "" } 
      });

      for (const book of booksDueSoon) {
        const message = `📚 *DearPages Library Alert*\n\nHey ${book.borrowerName}! Just a reminder that your time with "${book.title}" is up in 2 days. \n\nPlease reach out if you need to extend the loan!`;

        let formattedNumber = book.borrowerPhone.replace(/\D/g, ''); 
        const chatId = `${formattedNumber}@c.us`; 

        await whatsappClient.sendMessage(chatId, message);
        console.log(`✅ Automated WhatsApp sent to ${book.borrowerName}`);
      }
    } catch (error) { 
      console.error('Cron WhatsApp Error:', error); 
    }
  });
};

module.exports = startCronJobs;
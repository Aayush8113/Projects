const Book = require('../models/Book');
const { getFlirtyNotification } = require('../utils/notificationEngine');
// IMPORT THE FREE WHATSAPP BOT TO SEND REAL-TIME MESSAGES
const whatsappClient = require('../utils/whatsappBot'); 

exports.addBook = async (req, res, next) => {
  try {
    const book = await Book.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: book });
  } catch (err) { next(err); }
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ owner: req.user.id }).lean();
    res.status(200).json({ success: true, count: books.length, data: books });
  } catch (err) { next(err); }
};

exports.lendBook = async (req, res, next) => {
  try {
    const { borrowerName, borrowerRelationship, borrowerPhone, durationDays } = req.body;
    const days = parseInt(durationDays) || 14; 
    const dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id, status: { $ne: 'With Friends' } },
      { 
        status: 'With Friends', 
        borrowerName, 
        borrowerRelationship, 
        borrowerPhone, 
        dateLent: Date.now(), 
        borrowDurationDays: days, 
        dueDate: dueDate
      },
      { new: true }
    );

    if (!book) return res.status(400).json({ success: false, message: 'Book is already borrowed. Join the waitlist!' });

    const message = getFlirtyNotification(book.title, borrowerName, borrowerRelationship);
    res.status(200).json({ success: true, notification: message, data: book });
  } catch (err) { next(err); }
};

exports.reserveBook = async (req, res, next) => {
  try {
    const { reserverName } = req.body;
    const book = await Book.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (book.status !== 'With Friends') return res.status(400).json({ success: false, message: 'Book is available now!' });
    if (book.waitlist.some(w => w.userId && w.userId.toString() === req.user.id)) return res.status(400).json({ success: false, message: 'You are already on the waitlist.' });

    book.waitlist.push({ userId: req.user.id, name: reserverName });
    await book.save();

    // 🚀 REAL-TIME WHATSAPP PING TO CURRENT BORROWER
    if (book.borrowerPhone) {
      try {
        const message = `📚 *Family Library Alert*\n\nHey ${book.borrowerName}! Just letting you know that *${reserverName}* is waiting to read "${book.title}" next.\n\nPlease Auto-Transfer it to them when you are finished!`;
        let formattedNumber = book.borrowerPhone.replace(/\D/g, ''); 
        const chatId = `${formattedNumber}@c.us`; 
        await whatsappClient.sendMessage(chatId, message);
        console.log(`Sent Waitlist Ping to ${book.borrowerName}`);
      } catch (error) {
        console.log("WhatsApp bot not connected yet, ping skipped.");
      }
    }

    res.status(200).json({ success: true, message: `Added to waitlist! ${book.borrowerName} has been notified.`, data: book });
  } catch (err) { next(err); }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { memoryNote } = req.body;
    const book = await Book.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

    if (memoryNote && book.borrowerName) {
      book.memoryLogs.push({ readerName: book.borrowerName, memory: memoryNote });
    }

    if (book.waitlist && book.waitlist.length > 0) {
      const nextReader = book.waitlist.shift(); 
      book.borrowerName = nextReader.name;
      book.borrowerRelationship = "Waitlist Friend";
      book.borrowerPhone = null; 
      book.dateLent = Date.now();
      book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); 
    } else {
      book.status = 'All Books';
      book.borrowerName = undefined;
      book.borrowerRelationship = undefined;
      book.borrowerPhone = undefined;
      book.dateLent = undefined;
      book.dueDate = undefined;
      book.borrowDurationDays = undefined;
    }

    await book.save();
    res.status(200).json({ success: true, message: "Returned successfully", data: book });
  } catch (err) { next(err); }
};

exports.transferBook = async (req, res, next) => {
  try {
    // We now capture the new person's phone number during transfer!
    const { newBorrowerName, newBorrowerRelationship, borrowerPhone, durationDays } = req.body;
    const days = parseInt(durationDays) || 14; 
    
    const book = await Book.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!book || book.status !== 'With Friends') return res.status(400).json({ success: false, message: 'Book must be lent out before it can be transferred.' });

    book.borrowerName = newBorrowerName;
    book.borrowerRelationship = newBorrowerRelationship;
    book.borrowerPhone = borrowerPhone || null; 
    book.dateLent = Date.now();
    book.borrowDurationDays = days;
    book.dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    // If they were on the waitlist, remove them since they now have the book
    book.waitlist = book.waitlist.filter(w => w.name !== newBorrowerName);

    await book.save();
    res.status(200).json({ success: true, message: `Transferred to ${newBorrowerName}!`, data: book });
  } catch (err) { next(err); }
};

exports.extendBook = async (req, res, next) => {
  try {
    const { additionalDays } = req.body;
    const days = parseInt(additionalDays) || 7; 
    
    const book = await Book.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!book || book.status !== 'With Friends') return res.status(400).json({ success: false, message: 'Book is not currently lent out.' });

    const currentDue = book.dueDate ? new Date(book.dueDate) : new Date();
    currentDue.setDate(currentDue.getDate() + days);
    
    book.dueDate = currentDue;
    book.borrowDurationDays = (book.borrowDurationDays || 0) + days;

    await book.save();

    // 🚀 Notify them of the extension!
    if (book.borrowerPhone) {
      try {
        const message = `⏳ *Library Update*\n\nHey ${book.borrowerName}, your loan for "${book.title}" has been extended! You now have ${days} extra days. Enjoy!`;
        let formattedNumber = book.borrowerPhone.replace(/\D/g, ''); 
        const chatId = `${formattedNumber}@c.us`; 
        await whatsappClient.sendMessage(chatId, message);
      } catch (error) {}
    }

    res.status(200).json({ success: true, message: `Loan extended by ${days} days!`, data: book });
  } catch (err) { next(err); }
};

exports.getReadingNudge = async (req, res, next) => {
  try {
    const unreadBook = await Book.findOne({ owner: req.user.id, status: 'Next Up' }).select('title').lean();
    const message = unreadBook ? getFlirtyNotification(unreadBook.title, null, 'Waiting') : "Your shelf is perfectly managed! 📚";
    res.status(200).json({ success: true, notification: message });
  } catch (err) { next(err); }
};

exports.getLentHistory = async (req, res, next) => {
  try {
    const lentBooks = await Book.find({ owner: req.user.id, status: 'With Friends' }).sort({ dateLent: -1 }).lean();
    res.status(200).json({ success: true, data: lentBooks });
  } catch (err) { next(err); }
};
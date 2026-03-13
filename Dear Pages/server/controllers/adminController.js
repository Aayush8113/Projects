const Book = require('../models/Book');
const User = require('../models/User');

exports.getAdminDashboard = async (req, res, next) => {
  try {
    // ARCHITECT NOTE: Run independent queries in parallel using Promise.all
    // This reduces api latency significantly (e.g., 400ms -> 150ms)
    const [totalMembers, totalBooks, lentBooks, familyMembers, recentActivity] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Book.countDocuments(),
      Book.countDocuments({ status: 'With Friends' }),
      User.aggregate([
        { $match: { role: 'user' } },
        { $lookup: { from: 'books', localField: '_id', foreignField: 'owner', as: 'userBooks' } },
        { $project: { name: 1, email: 1, bookCount: { $size: '$userBooks' } } }
      ]),
      Book.find().sort({ updatedAt: -1 }).limit(10).populate('owner', 'name').lean()
    ]);

    const stats = {
      totalMembers,
      totalBooks,
      lentBooks,
      familyMembers,
      recentActivity
    };

    res.status(200).json({ success: true, data: stats });
  } catch (err) { next(err); }
};

exports.getUserBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ owner: req.params.id }).lean();
    res.status(200).json({ success: true, data: books });
  } catch (err) { next(err); }
};

exports.forceReturnBook = async (req, res, next) => {
  try {
    // ARCHITECT NOTE: Use $unset to completely remove fields from DB document 
    // instead of setting them to null (saves storage space)
    await Book.findByIdAndUpdate(req.params.id, { 
      $set: { status: 'All Books' },
      $unset: { borrowerName: "", borrowerRelationship: "" }
    });

    res.status(200).json({ success: true, message: "Admin reset success" });
  } catch (err) { next(err); }
};
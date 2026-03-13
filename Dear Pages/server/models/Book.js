const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    
    category: { type: String, default: "Uncategorized", index: true },
    coreConcept: { type: String, default: "", trim: true }, 
    
    status: {
      type: String,
      enum: ["Reading Now", "Next Up", "With Friends", "All Books", "Dream Books"],
      default: "All Books",
    },
    
    borrowerName: { type: String, default: null },
    borrowerRelationship: { type: String, default: null },
    borrowerPhone: { type: String, default: null }, 
    dateLent: { type: Date, default: null },
    borrowDurationDays: { type: Number, default: 0 },
    dueDate: { type: Date, default: null },

    waitlist: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        reservedAt: { type: Date, default: Date.now }
      }
    ],

    memoryLogs: [
      {
        readerName: { type: String },
        memory: { type: String },
        dateAdded: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

BookSchema.index({ owner: 1, category: 1 });
module.exports = mongoose.model("Book", BookSchema);
const express = require('express');
const router = express.Router();
const { 
  getAdminDashboard, 
  getUserBooks, 
  forceReturnBook 
} = require('../controllers/adminController');
const { protect, authorize } = require('../utils/authMiddleware');

// --- Apply Security to All Admin Routes ---
// 1. User must be logged in
router.use(protect);
// 2. User must be an 'admin'
router.use(authorize('admin'));

// --- Define Routes ---
// GET /api/v1/admin/dashboard
router.get('/dashboard', getAdminDashboard);

// GET /api/v1/admin/users/:id/books
router.get('/users/:id/books', getUserBooks);

// PATCH /api/v1/admin/books/:id/return
router.patch('/books/:id/return', forceReturnBook);

// ✅ EXPORT FIX: This must export the router directly
module.exports = router;
import express from 'express';
import { saveDrawings, loadDrawings, deleteDrawings } from '../controllers/drawing.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All drawing routes require authentication
router.use(protect);

// POST /api/drawings/save
router.post('/save', saveDrawings);

// GET /api/drawings & DELETE /api/drawings
router.route('/')
    .get(loadDrawings)
    .delete(deleteDrawings);

export default router;

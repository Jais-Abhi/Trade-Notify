import express from 'express';
import { saveDrawings, loadDrawings, deleteDrawings } from '../controllers/chartDrawing.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All drawing routes require authentication
router.use(protect);

// POST /api/chart-drawings/save
router.post('/save', saveDrawings);

// GET /api/chart-drawings & DELETE /api/chart-drawings
router.route('/')
    .get(loadDrawings)
    .delete(deleteDrawings);

export default router;

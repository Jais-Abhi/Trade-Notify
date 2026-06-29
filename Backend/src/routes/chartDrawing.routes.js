import express from 'express';
import { saveDrawings, loadDrawings, deleteDrawings, deleteDrawingById } from '../controllers/chartDrawing.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All drawing routes require authentication
router.use(protect);

// POST /api/chart-drawings/save
router.post('/save', saveDrawings);

// DELETE /api/chart-drawings/:drawingId
router.delete('/:drawingId', deleteDrawingById);

// GET /api/chart-drawings & DELETE /api/chart-drawings
router.route('/')
    .get(loadDrawings)
    .delete(deleteDrawings);

export default router;

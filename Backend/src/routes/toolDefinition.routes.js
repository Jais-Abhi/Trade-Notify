import express from 'express';
import { getToolDefinitions } from '../controllers/toolDefinition.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Admin route may be protected; currently only authenticated users can access it.
router.get('/', protect, getToolDefinitions);

export default router;

import express from 'express';
import { getMergedTools, patchToolPreference } from '../controllers/toolPreference.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getMergedTools);
router.patch('/:toolId', patchToolPreference);

export default router;

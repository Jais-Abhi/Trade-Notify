import express from 'express';
import { 
    addToWishlist, 
    getWishlist, 
    removeFromWishlist 
} from '../controllers/wishlist.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply protection to all wishlist routes
router.use(protect);

router.route('/')
    .get(getWishlist)
    .post(addToWishlist);

router.route('/:symbol')
    .delete(removeFromWishlist);

export default router;

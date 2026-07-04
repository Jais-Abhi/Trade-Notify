import express from 'express';
import { stockAssetHandlers, cryptoAssetHandlers, forexAssetHandlers } from '../controllers/asset.controller.js';

const router = express.Router();

router.get('/stocks', stockAssetHandlers.getAllAssets);
router.get('/stocks/search', stockAssetHandlers.searchAssets);

router.get('/crypto', cryptoAssetHandlers.getAllAssets);
router.get('/crypto/search', cryptoAssetHandlers.searchAssets);

router.get('/forex', forexAssetHandlers.getAllAssets);
router.get('/forex/search', forexAssetHandlers.searchAssets);

export default router;

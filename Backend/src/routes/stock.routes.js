import express from "express";
import { getAllStocks, searchStocks } from "../controllers/stock.controller.js";

const router = express.Router();

router.get("/", getAllStocks);
router.get("/search", searchStocks);

export default router;

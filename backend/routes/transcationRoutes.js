import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionByUserId,
  getTransactionSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary/:userId", getTransactionSummary);
router.get("/:user_id", getTransactionByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;

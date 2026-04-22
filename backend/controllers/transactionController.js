import { sql } from "../config/db.js";

export const getTransactionByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error Getting Transactions", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *`;

    res.status(201).json(result[0]);
  } catch (error) {
    console.log("Error while creating the transaction", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction id" });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error Deleting Transaction", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTransactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND category = 'income'`;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND category = 'expense'`;

    res.status(200).json({
      balance: parseFloat(balanceResult[0].balance),
      income: parseFloat(incomeResult[0].income),
      expenses: parseFloat(expenseResult[0].expenses),
    });
  } catch (error) {
    console.log("Error getting summary", error);
    res.status(500).json({ message: "Server Error" });
  }
};

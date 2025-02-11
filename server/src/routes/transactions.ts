import express from 'express';
import { auth } from '../middleware/auth';
import Transaction from '../models/Transaction';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user.id
    });
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;

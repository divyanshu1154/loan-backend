import { Router, Request, Response } from 'express';
import Loan, { LoanStatus } from '../models/Loan';
import User from '../models/User';
import authenticateJWT from '../middleware/authMiddleware';
const router = Router();

// Create a new loan request
router.post('/loans', async (req: Request, res: Response) => {
  try {
    const userId = "671016d76e08f5b3bc32c091";
    const {fullName, loanAmount, loanTenure, employmentStatus, reason, employmentAddress } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }else{
      const newLoan = new Loan({
        user: user._id,
        fullName,
        loanAmount,
        loanTenure,
        employmentStatus,
        reason,
        employmentAddress,
      });
  
      await newLoan.save();
      res.status(201).json({ message: 'Loan request submitted successfully', loan: newLoan });
    }

  } catch (error) {
    // res.status(500).json({ error: 'Failed to submit loan request' });
    res.status(500).json({ error });
  }
});

// Get all loans for a specific user
router.get('/user/loans', async (req: Request, res: Response) => {
  const userId = "671016d76e08f5b3bc32c091"

  try {
    const loans = await Loan.find({ user: userId });
    if (!loans) {
    res.status(404).json({ error: 'No loans found for this user' });
    }else{
      res.status(200).json(loans);
    }
  } catch (error) {
    // res.status(500).json({ error: 'Failed to fetch loans' });
    res.status(500).json({ error });
  }
});

// Get all loan requests made by all users (for company)
router.get('/company/loans', async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all loan requests' });
  }
});

// Update loan status (approve, reject, pending)
router.patch('/loans/status', async (req: Request, res: Response) => {
  const { loanId, status } = req.body;

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
    }else{
      loan.status = status;
      await loan.save();
      res.status(200).json({ message: `Loan status updated to ${status}`, loan });
    }

  } catch (error) {
    res.status(500).json({ error: 'Failed to update loan status' });
  }
});

export default router;

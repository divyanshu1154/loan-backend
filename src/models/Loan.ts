import { Schema, model, Types } from 'mongoose';

enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

interface ILoan {
  user: Types.ObjectId;
  fullName: string;
  loanAmount: number;
  loanTenure: string;
  employmentStatus: string;
  reason: string;
  employmentAddress: string;
  status: LoanStatus;
  createdAt: Date;
}

const loanSchema = new Schema<ILoan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  loanTenure: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  reason: { type: String, required: true },
  employmentAddress: { type: String, required: true },
  status: { type: String, enum: LoanStatus, default: LoanStatus.Pending },
  createdAt: { type: Date, default: Date.now },
});

const Loan = model<ILoan>('Loan', loanSchema);
export default Loan;
export { LoanStatus };

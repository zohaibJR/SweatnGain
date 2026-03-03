import mongoose from 'mongoose';

const paymentRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName:     { type: String, required: true },
  userEmail:    { type: String, required: true },
  screenshotPath: { type: String, required: true }, // local file path
  transactionNote: { type: String, default: '' },   // optional note from user
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: { type: String, default: '' },         // optional note from admin
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('PaymentRequest', paymentRequestSchema);
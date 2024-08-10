import { Document, ObjectId } from 'mongoose';
import { Booking, User } from '@offisito-shared';

export enum TransactionType {
  Payment = 'payment',
  Refund = 'refund',
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
  Adjustment = 'adjustment',
}

export enum PaymentMethod {
  CreditCard = 'credit_card',
  PayPal = 'paypal',
  BankTransfer = 'bank_transfer',
  Other = 'other',
}

export enum TransactionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Reversed = 'reversed',
  Canceled = 'canceled',
}

export interface Transaction extends Document {
  _id: ObjectId;
  booking: ObjectId | Booking;
  user: ObjectId | User;
  host?: ObjectId | User;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  paymentProvider?: string;
  providerTransactionId?: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

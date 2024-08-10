import { getModel } from '@base-shared';
import mongoose from 'mongoose';
import {
  AcceptedLeaseType,
  Booking,
  RequestStatus,
  WeekDays,
} from '@offisito-shared';

export default () =>
  getModel<Booking>('booking', {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
    },
    customDays: [{ type: String, enum: Object.values(WeekDays) }],
    payment: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    leaseType: {
      type: String,
      enum: Object.values(AcceptedLeaseType),
    },
    contractLength: { type: Number },
    requestStatus: {
      type: String,
      enum: Object.values(RequestStatus),
    },
    readTS: { type: [Number] },
    note: { type: String },
  });

export enum BookingStatus {
  Draft = 'draft',
  Offer = 'offer',
  CounterOffer = 'counter_offer',
  Active = 'active',
  Suspended = 'suspended',
  Paused = 'paused',
  Archived = 'archived',
  Declined = 'declined',
  Canceled = 'canceled',
}

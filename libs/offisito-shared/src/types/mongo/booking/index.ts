import { Document, ObjectId } from 'mongoose';
import { AcceptedLeaseType, Asset, WeekDays } from '../assets';
import { User } from '../auth';
import { TODO } from '@base-shared';

export enum RequestStatus {
  Draft = 'draft',
  Offer = 'offer',
  CounterOffer = 'counter_offer',
  Active = 'active',
  Suspended = 'suspended',
  Paused = 'paused',
  Archived = 'archived',
  Declined = 'declined',
}

export interface Booking extends Document {
  _id: ObjectId;
  guest?: ObjectId;
  asset?: ObjectId;
  daysInWeek?: {
    sun: boolean;
    mon: boolean;
    tues: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
  };
  payment?: string;
  startDate?: Date;
  endDate?: Date;
  leaseType?: AcceptedLeaseType;
  contractLength?: number;
  requestStatus?: RequestStatus;
  readTS?: number[];
  note?: string;
  name?: string;
}

export interface BookingRequest extends Document {
  user: ObjectId | User;
  asset: ObjectId | Asset;
  requestedLeaseType: TODO;
  status: RequestStatus;
  startDate: Date;
  endDate?: Date;
  customDays?: WeekDays[];
  offerDetails?: string;
}

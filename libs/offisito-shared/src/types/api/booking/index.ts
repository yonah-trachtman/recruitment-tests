import { Booking, UserType } from '../../';

export type BookingDetails = Omit<
  Booking,
  UserType.admin | 'payment' | 'requestStatus' | 'readTS'
>;

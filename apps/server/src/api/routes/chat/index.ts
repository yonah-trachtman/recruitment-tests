import { highOrderHandler } from '@base-backend';
import { AuthenticatedRequest, User } from '@auth-backend';
import { InvalidInputError, TODO, UnauthorizedError } from '@base-shared';
import user from '../../../services/mongo/auth/user';
import bookingModel from '../../../services/mongo/bookings/bookingModel';
import { UserType } from '@offisito-shared';
import companyModel from '../../../services/mongo/assets/companyModel';
import assetModel from '../../../services/mongo/assets/assetModel';
import { conversation } from '@chat-backend';
import { sidesNames } from '../apiRouter';
import { Router } from 'express';
import { sendMessage } from '../../../controllers/chat';

export const specialChatRouter = Router();

specialChatRouter.get(
  '/conversations/idByBookingId/:id',
  highOrderHandler((async (req: AuthenticatedRequest) => {
    if (!req.user) throw new UnauthorizedError('Please log in');
    if (!req.params['id']) throw new InvalidInputError('No Id received');
    const UserModel = user();
    const booking = await bookingModel().findById(req.params['id']);
    const userDoc =
      req.user.userType === UserType.host
        ? await UserModel.findById(booking?.guest)
        : await UserModel.findById(
            (
              await companyModel().findById(
                (
                  await assetModel().findById(
                    booking ? booking.asset : req.params['id'],
                  )
                )?.companyId,
              )
            )?.host,
          );
    const results = await conversation(...sidesNames).findOne({
      $or: [
        { guestId: userDoc?._id.toString() },
        { hostId: userDoc?._id.toString() },
      ],
    });
    if (results) return { statusCode: 200, body: results };
    if (!userDoc?._id?.toString())
      throw new UnauthorizedError('No partner found');
    return { statusCode: 201, body: userDoc._id.toString() };
  }) as TODO),
);

specialChatRouter.post(
  '/messages',
  highOrderHandler(async (req: AuthenticatedRequest) => {
    if (!String((req.user as User)?._id))
      throw new UnauthorizedError('Not logged in');
    const { conversationIdOrAddressee, message } = req.body;
    return sendMessage<UserType>(
      req.user as User,
      UserType,
      conversationIdOrAddressee,
      message,
    );
  }) as TODO,
);

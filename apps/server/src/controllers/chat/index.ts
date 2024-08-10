import { User } from '@auth-backend';
import { conversation, message } from '@chat-backend';
import user from '../../services/mongo/auth/user';
import companyModel from '../../services/mongo/assets/companyModel';
import { TODO, UnauthorizedError } from '@base-shared';

export const sendMessage = async <ENUM>(
  userDoc: User,
  UserTypeEnum: { [key: string]: ENUM },
  conversationIdOrAddressee: string,
  messageToSend: string,
) => {
  const Message = message();
  const ConversationModel = conversation('hostId', 'guestId');
  let conversationDoc = await ConversationModel.findById(
    conversationIdOrAddressee,
  );
  let hostId: User | string = await user().findById(conversationIdOrAddressee);
  if (!hostId) {
    const company = await companyModel().findById(conversationIdOrAddressee);
    hostId = company?.host?.toString();
  } else hostId = String((hostId as User)?._id);
  if (hostId) {
    conversationDoc = await ConversationModel.findOne({
      hostId,
      guestId: String(userDoc._id),
    });
  }
  if (!conversationDoc?._id) {
    conversationDoc = new ConversationModel({
      ...(userDoc.userType === UserTypeEnum.host
        ?{ guestId: userDoc._id }
        :  { hostId: userDoc._id }),
      ...(userDoc.userType === UserTypeEnum.guest
        ?  { guestId: hostId }
        :{hostId: String(hostId) } ),
    });
    await conversationDoc.save();
  }
  console.log('String(user._id): ', String(userDoc._id));
  console.log('conversation: ', conversationDoc);
  if (
    String(userDoc._id) !== conversationDoc.hostId &&
    String(userDoc._id) !== conversationDoc.guestId
  )
    throw new UnauthorizedError('You are not part of the conversation');
  const newMessage = new Message({
    ownerId: String(userDoc._id),
    conversationId: conversationDoc._id,
    message: messageToSend,
  });

  await newMessage.save();
  return { statusCode: 201, body: 'Message Sent' };
};

import mongoose, { Schema } from 'mongoose';
import Message from '../../domain_entities/message';

const messageSchema: Schema<Message> = new Schema({
    conversationId: {
        type: String,
        ref: 'conversation',
    },
    senderId: {
        type: String,
    },
    message: {
        type: String,
    },
    creationTime: {
        type: Date,
        default: Date.now,
    },
});

const messageModel = mongoose.model<Message>('message', messageSchema);
export { messageModel };




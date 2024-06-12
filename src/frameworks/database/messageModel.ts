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
    contentType: {
        type: String,
        enum: ['video', 'image', 'file', 'text'],
        default: 'text'
    },
    message: {
        type: String,
    },
    creationTime: {
        type: Date,
        default: Date.now,
    },
    status: 
    { 
        type: String, 
        enum: ['read', 'unread'], 
        default: 'unread' 
    }
});

const messageModel = mongoose.model<Message>('message', messageSchema);
export { messageModel };




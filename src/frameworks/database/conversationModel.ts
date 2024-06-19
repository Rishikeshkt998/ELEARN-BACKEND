import mongoose, { Schema, Types } from 'mongoose';
import Conversation from '../../domain_entities/conversations';

const conversationSchema: Schema<Conversation> = new Schema({
    members: [
        {
            type: Types.ObjectId,
            required: true
        }
    ],
    creationTime: {
        type: Date,
        default: Date.now,
    },
    updationTime: {
        type: Date
    }
});

const conversationModel = mongoose.model<Conversation>('conversation', conversationSchema);
export { conversationModel }
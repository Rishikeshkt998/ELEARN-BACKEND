import mongoose, { Schema } from 'mongoose';
import Conversation from '../../domain_entities/conversations';

const conversationSchema: Schema<Conversation> = new Schema({
    members: [
        {
            type: String,
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
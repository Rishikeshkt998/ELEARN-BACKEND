import mongoose, { Schema, Types } from 'mongoose';
import Conversation from '../../domain_entities/conversations';

const conversationSchema: Schema<Conversation> = new Schema({
    members: [
        {
            type: Types.ObjectId,
            required: true
        }
    ],
    latestMessage: {
        type: String,
        default: ""
    }

    
}, { timestamps: true });

const conversationModel = mongoose.model<Conversation>('conversation', conversationSchema);
export { conversationModel }
import { Schema, model } from "mongoose";
import Chat from "../../domain_entities/chat";

const chatSchema = new Schema<Chat>(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: Schema.Types.ObjectId, ref: "user" }],
        latestMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
        groupAdmin: { type: Schema.Types.ObjectId, ref: "user", default: null },
    },
    { timestamps: true }
);

const ChatModel = model<Chat>("Chat", chatSchema);

export default ChatModel;
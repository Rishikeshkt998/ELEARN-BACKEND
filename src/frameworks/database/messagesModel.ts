import { Schema, model } from "mongoose";
import Messages from "../../domain_entities/Messages";

const messageSchema = new Schema<Messages>(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

const Message = model<Messages>("Message", messageSchema);

export default Message;
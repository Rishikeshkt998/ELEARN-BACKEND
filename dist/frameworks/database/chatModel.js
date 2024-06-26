"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
    latestMessage: { type: mongoose_1.Schema.Types.ObjectId, ref: "Message", default: null },
    groupAdmin: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", default: null },
}, { timestamps: true });
const ChatModel = (0, mongoose_1.model)("Chat", chatSchema);
exports.default = ChatModel;

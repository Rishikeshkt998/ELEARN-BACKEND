import mongoose from "mongoose";


interface Chat {
    chatName: string;
    isGroupChat: boolean;
    users: mongoose.Types.ObjectId[];
    latestMessage: mongoose.Types.ObjectId;
    groupAdmin?: mongoose.Types.ObjectId;
}
export default Chat
import Chat from "./chat";
import User from "./user";
interface Messages {
    sender: User;
    content: string;
    chat: Chat;
    readBy: User[];
    createdAt: Date;
    updatedAt: Date;
}
export default Messages

import mongoose from "mongoose"

interface Message {
    _id?: string,
    conversationId: string,
    senderId: string,
    message: string,
    creationTime: Date
    contentType?:string
    status?:string
}

export default Message;
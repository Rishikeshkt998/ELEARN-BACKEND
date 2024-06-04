import Message from "../../domain_entities/message";
import IchatRepository from "../../useCase/interface/IchatRepository";
import { conversationModel } from "../database/conversationModel";
import { messageModel } from "../database/messageModel";
import { userModel } from "../database/userModel";
import { trainerModel } from "../database/trainerModel";
import Trainer from "../../domain_entities/trainer";
import mongoose, { ObjectId } from "mongoose";
import User from "../../domain_entities/user";
import chatModel from "../database/chatModel";





class chatRepository implements IchatRepository {
    async getMessages(conversationId: string): Promise<any> {
        try {
            const messages = await messageModel.find({conversationId: conversationId })
            if (messages) {
                return messages
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addMessage(data: Message): Promise<any> {
        try {
            const newMessage = new messageModel(data);
            await newMessage.save()
            // const conversation = await conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() })
            return newMessage
        } catch (error) {
            console.log(error)
        }
    }

    async addImageMessage(conversationId: string, sellerId: string, image: string): Promise<any> {
        try {
            const data = {
                conversationId: conversationId,
                sellerId: sellerId,
                message: image
            }
            const newMessage = new messageModel(data);
            await newMessage.save()
            const conversation = await conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() })
            return newMessage
        } catch (error) {
            console.log(error)
        }
    }
    async save(senderId: string, receiverId: string): Promise<any> {
        try {
            const conversationExist = await conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
            if (conversationExist) {
                return conversationExist
            }
            const newConversation = new conversationModel({ members: [senderId, receiverId] });
            return await newConversation.save()
        } catch (error) {
            console.log(error)
        }
    }

    async getConversations(userId:string,tutorId: string): Promise<any> {
        try {
            const conversations = await conversationModel.find({ members: { $all: [userId, tutorId] } })
            if (conversations) {
                return conversations
            } else {
                return null
            }
        } catch (error) {
            console.log(error)
        }
    }

    async findTutorById(userId: string): Promise<any> {
        try {
            const findUserById = await trainerModel.findById(userId)
            return findUserById
        } catch (error) {
            console.log(error)
        }
    }
    async findUserById(userId: string): Promise<any> {
        try {
            const findUserById = await userModel.findById(userId)
            return findUserById
        } catch (error) {
            console.log(error)
        }
    }
    async findTutorForchat(): Promise<Trainer[]> {
        const trainerData: (Trainer & { _id: ObjectId })[] = await trainerModel.find()
        const findedtrainer: Trainer[] = trainerData.map((trainer) => ({
            id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            password: trainer.password,
            phone: trainer.phone,
            dateOfBirth: trainer.dateOfBirth,
            isVerified: trainer.isVerified,
            isBlocked: trainer.isBlocked

        }));
        return findedtrainer


    }
    async findUserForChat(): Promise<User[]> {
        const userData: (User & { _id: ObjectId })[] = await userModel.find()
        const findeduser: User[] = userData.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            profileimage: user.profileimage,
            otp: user.otp,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked

        }));
        return findeduser


    }





//new
    // async accessChat(userId: string, current_userId: string) {
    //     try {
    //         var isChat: any = await chatModel.find({
    //             isGroupChat: false,
    //             $and: [
    //                 { users: { $elemMatch: { $eq: current_userId } } },
    //                 { users: { $elemMatch: { $eq: userId } } },
    //             ],
    //         })
    //             .populate("users", "-password")
    //             .populate("latestMessage");

    //         isChat = await userModel.populate(isChat, {
    //             path: "latestMessage.sender",
    //             select: "name pic email",
    //         });
    //         return isChat;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }) {
    //     try {
    //         const createdChat = await chatModel.create(chatData);
    //         const FullChat = await chatModel.findOne({ _id: createdChat._id }).populate(
    //             "users",
    //             "-password"
    //         );
    //         return FullChat;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async getChat(userId: string) {
    //     try {
    //         let result;
    //         const chat = await chatModel.find({ users: { $elemMatch: { $eq: userId } } })
    //             .populate("users", "-password")
    //             .populate("groupAdmin", "-password")
    //             .populate("latestMessage")
    //             .sort({ updatedAt: -1 })
    //         if (chat) {
    //             result = await userModel.populate(chat, {
    //                 path: "latestMessage.sender",
    //                 select: "name pic email",
    //             })
    //             return result;
    //         }
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async createGroupChat(name: string, users: any, groupAdmin: any) {
    //     try {
    //         const groupChat = await chatModel.create({
    //             chatName: name,
    //             users,
    //             isGroupChat: true,
    //             groupAdmin
    //         });

    //         const fullGroupChat = await chatModel.findOne({ _id: groupChat._id })
    //             .populate("users", "-password")
    //             .populate("groupAdmin", "-password");

    //         return fullGroupChat;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async renameGroup(chatId: string, chatName: string) {
    //     try {
    //         const updatedchat = await chatModel.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
    //             .populate('users', '-password')
    //             .populate('groupAdmin', '-password');
    //         return updatedchat;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async addToGroup(chatId: string, userId: string) {
    //     try {
    //         const added = await chatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
    //             .populate("users", "-password")
    //             .populate("groupAdmin", "-password");
    //         return added;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async removeFromGroup(chatId: string, userId: string) {
    //     try {
    //         const removed = await chatModel.findByIdAndUpdate(
    //             chatId,
    //             {
    //                 $pull: { users: userId },
    //             },
    //             {
    //                 new: true,
    //             }
    //         )
    //             .populate("users", "-password")
    //             .populate("groupAdmin", "-password");
    //         return removed;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async postShareSuggestedUsers(userId: string) {
    //     try {
    //         const ObjectId = mongoose.Types.ObjectId;
    //         const UserId = new ObjectId(userId)

    //         const users = await chatModel.aggregate([
    //             { $match: { isGroupChat: false } },
    //             { $match: { users: UserId } },
    //             { $project: { otherUserID: { $setDifference: ["$users", [UserId]] } } },
    //             {
    //                 $lookup: {
    //                     from: "users",
    //                     localField: "otherUserID",
    //                     foreignField: "_id",
    //                     as: "otherUserDetails"
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     "_id": { $arrayElemAt: ["$otherUserDetails._id", 0] },
    //                     "name": { $arrayElemAt: ["$otherUserDetails.name", 0] },
    //                     "profile_picture": { $arrayElemAt: ["$otherUserDetails.profile_picture", 0] },
    //                     "headline": { $arrayElemAt: ["$otherUserDetails.headLine", 0] }
    //                 }
    //             }
    //         ]);
    //         return users;
    //     } catch (error) {
    //         console.log(error as Error)
    //     }
    // }
    // async getAllUsers(search: string | undefined, userId: string) {
    //     try {
    //         const keyword = search ? {
    //             $or: [
    //                 { name: { $regex: search, $options: 'i' } },
    //                 { email: { $regex: search, $options: 'i' } }
    //             ]
    //         } : {}
    //         const allUsers = await userModel.find(keyword).find({ _id: { $ne: userId } });
    //         return allUsers;
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    
    



}
export default chatRepository
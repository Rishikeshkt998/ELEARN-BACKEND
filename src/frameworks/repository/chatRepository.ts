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
            image:trainer.image,
            password: trainer.password,
            phone: trainer.phone,
            dateOfBirth: trainer.dateOfBirth,
            isVerified: trainer.isVerified,
            isBlocked: trainer.isBlocked

        }));
        return findedtrainer


    }
    async findUserForChat(): Promise<User[]> {
        try {
            const user = await userModel.aggregate([
                {
                    $lookup: {
                        from: "messages",
                        localField: "_id",
                        foreignField: "senderId",
                        as: "latestMessage"
                    }
                },
                {
                    $unwind: { path: "$latestMessage", preserveNullAndEmptyArrays: true }
                },
                {
                    $sort: { "latestMessage.creationTime": -1 } 
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        phone: { $first: "$phone" },
                        password: { $first: "$password" },
                        profileimage: { $first: "$profileimage" },
                        latestMessage: { $first: "$latestMessage" } 
                    }
                },
                {
                    $sort: { "latestMessage.creationTime": -1 } 
                }
            ]);
            const findeduser = user.map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profileimage: user.profileimage,
                otp: user.otp,
                isVerified: user.isVerified,
                isBlocked: user.isBlocked,
                latestMessage: user.latestMessage ,
                password: user.password
            }));

            return findeduser;
        } catch (error) {
            console.log(error);
            throw error;
        }
        


    }






    
    



}
export default chatRepository
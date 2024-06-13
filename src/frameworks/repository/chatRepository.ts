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
            const messages = await messageModel.find({ conversationId: conversationId })
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
            return newMessage
        } catch (error) {
            console.log(error)
        }
    }
    async ReadMessage(id: any): Promise<any> {
        try {
            console.log("idvalue", id)
            const message = await messageModel.findById(id);
            if (message) {
                message.status = 'read';
                await message.save();

            }


            return message;
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

    async getConversations(userId: string, tutorId: string): Promise<any> {
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
        try {
            const trainers = await trainerModel.aggregate([
                {
                    $lookup: {
                        from: "conversation",
                        let: { userId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$$userId", "$members"] } } },
                            { $sort: { updationTime: -1 } }
                        ],
                        as: "latestConversations"
                    }
                },
                {
                    $unwind: { path: "$latestConversations", preserveNullAndEmptyArrays: true }
                },
                {
                    $sort: { "latestConversations.updationTime": -1 }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        phone: { $first: "$phone" },
                        password: { $first: "$password" },
                        image: { $first: "$image" },
                        dateOfBirth: { $first: "$dateOfBirth" },
                        isVerified: { $first: "$isVerified" },
                        isBlocked: { $first: "$isBlocked" },
                    }
                },
                {
                    $sort: { "latestConversation.updationTime": -1 }
                }
            ]);

            const findedTrainers = trainers.map((trainer: any) => ({
                id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                phone: trainer.phone,
                profileimage: trainer.profileimage,
                dateOfBirth: trainer.dateOfBirth,
                isVerified: trainer.isVerified,
                isBlocked: trainer.isBlocked,
                latestConversation: trainer.latestConversation,
                password: trainer.password
            }));

            return findedTrainers;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async findUserForChat(): Promise<User[]> {
        try {
            const users = await userModel.aggregate([
                {
                    $lookup: {
                        from: "conversation",
                        let: { userId: "$_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$$userId", "$members"] } } },
                            { $sort: { updationTime: -1 } }
                        ],
                        as: "latestConversations"
                    }
                },
                {
                    $unwind: { path: "$latestConversations", preserveNullAndEmptyArrays: true }
                },
                {
                    $sort: { "latestConversations.updationTime": -1 }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        phone: { $first: "$phone" },
                        password: { $first: "$password" },
                        profileimage: { $first: "$profileimage" },
                        otp: { $first: "$otp" },
                        isVerified: { $first: "$isVerified" },
                        isBlocked: { $first: "$isBlocked" },
                        latestConversation: { $first: "$latestConversations" }
                    }
                },
                {
                    $sort: { "latestConversation.updationTime": -1 }
                }
            ]);

            const findedUser = users.map((user: any) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                profileimage: user.profileimage,
                otp: user.otp,
                isVerified: user.isVerified,
                isBlocked: user.isBlocked,
                latestConversation: user.latestConversation,
                password: user.password
            }));

            return findedUser;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }













}
export default chatRepository
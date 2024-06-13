"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversationModel_1 = require("../database/conversationModel");
const messageModel_1 = require("../database/messageModel");
const userModel_1 = require("../database/userModel");
const trainerModel_1 = require("../database/trainerModel");
class chatRepository {
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messageModel_1.messageModel.find({ conversationId: conversationId });
                if (messages) {
                    return messages;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = new messageModel_1.messageModel(data);
                yield newMessage.save();
                return newMessage;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ReadMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("idvalue", id);
                const message = yield messageModel_1.messageModel.findById(id);
                if (message) {
                    message.status = 'read';
                    yield message.save();
                }
                return message;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addImageMessage(conversationId, sellerId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    conversationId: conversationId,
                    sellerId: sellerId,
                    message: image
                };
                const newMessage = new messageModel_1.messageModel(data);
                yield newMessage.save();
                const conversation = yield conversationModel_1.conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() });
                return newMessage;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    save(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationExist = yield conversationModel_1.conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
                if (conversationExist) {
                    return conversationExist;
                }
                const newConversation = new conversationModel_1.conversationModel({ members: [senderId, receiverId] });
                return yield newConversation.save();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(userId, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.conversationModel.find({ members: { $all: [userId, tutorId] } });
                if (conversations) {
                    return conversations;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTutorById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUserById = yield trainerModel_1.trainerModel.findById(userId);
                return findUserById;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUserById = yield userModel_1.userModel.findById(userId);
                return findUserById;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTutorForchat() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainers = yield trainerModel_1.trainerModel.aggregate([
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
                const findedTrainers = trainers.map((trainer) => ({
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
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findUserForChat() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.userModel.aggregate([
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
                const findedUser = users.map((user) => ({
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
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = chatRepository;

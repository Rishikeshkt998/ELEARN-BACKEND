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
const mongoose_1 = require("mongoose");
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
                const usersId = new mongoose_1.Types.ObjectId(userId);
                const tutorsId = new mongoose_1.Types.ObjectId(tutorId);
                const conversations = yield conversationModel_1.conversationModel.find({ members: { $all: [usersId, tutorsId] } });
                console.log("conversation", conversations);
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
    findTutorForchat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userId", id);
            const studentId = new mongoose_1.Types.ObjectId(id);
            const findedTrainers = yield conversationModel_1.conversationModel.aggregate([
                {
                    $match: {
                        "members.0": studentId,
                    },
                },
                {
                    $lookup: {
                        from: "trainers",
                        localField: "members.1",
                        foreignField: "_id",
                        as: "instructorDetails",
                    },
                },
                {
                    $unwind: "$instructorDetails",
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
            ]);
            console.log("trainers", findedTrainers);
            return findedTrainers;
        });
    }
    findUserForChat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("userId", id);
            const tutorId = new mongoose_1.Types.ObjectId(id);
            const findedTrainers = yield conversationModel_1.conversationModel.aggregate([
                {
                    $match: {
                        "members.1": tutorId,
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "members.0",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: "$userDetails",
                },
                {
                    $sort: {
                        updatedAt: -1,
                    },
                },
            ]);
            console.log("trainers", findedTrainers);
            return findedTrainers;
        });
    }
}
exports.default = chatRepository;

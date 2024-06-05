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
                // const conversation = await conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() })
                return newMessage;
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
            const trainerData = yield trainerModel_1.trainerModel.find();
            const findedtrainer = trainerData.map((trainer) => ({
                id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                password: trainer.password,
                phone: trainer.phone,
                dateOfBirth: trainer.dateOfBirth,
                isVerified: trainer.isVerified,
                isBlocked: trainer.isBlocked
            }));
            return findedtrainer;
        });
    }
    findUserForChat() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.userModel.find();
            const findeduser = userData.map((user) => ({
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
            return findeduser;
        });
    }
}
exports.default = chatRepository;

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
class chatUseCase {
    constructor(iChatRepository) {
        this.iChatRepository = iChatRepository;
    }
    newConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newConversation = yield this.iChatRepository.save(senderId, receiverId);
                if (newConversation) {
                    return { success: true, data: newConversation };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getConversations(userId, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield this.iChatRepository.getConversations(userId, tutorId);
                if (conversation) {
                    return { success: true, data: conversation };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.iChatRepository.getMessages(conversationId);
                if (messages) {
                    return { success: true, data: messages };
                }
                else {
                    return { success: false };
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
                const newMessage = yield this.iChatRepository.addMessage(data);
                if (newMessage) {
                    return { success: true, data: newMessage };
                }
                else {
                    return { success: false };
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
                const userFind = yield this.iChatRepository.findTutorById(userId);
                if (userFind) {
                    return { success: true, data: userFind };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFind = yield this.iChatRepository.findUserById(userId);
                if (userFind) {
                    return { success: true, data: userFind };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTutorsForChat() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainer = yield this.iChatRepository.findTutorForchat();
                if (trainer) {
                    return trainer;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUsersForChat() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.iChatRepository.findUserForChat();
                if (users) {
                    return users;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
;
exports.default = chatUseCase;

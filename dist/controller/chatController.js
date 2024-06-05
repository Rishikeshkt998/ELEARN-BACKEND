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
class chatController {
    constructor(chatCase) {
        this.chatCase = chatCase;
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = req.body;
                if (senderId && receiverId) {
                    const newConversation = yield this.chatCase.newConversation(senderId, receiverId);
                    if (newConversation === null || newConversation === void 0 ? void 0 : newConversation.success) {
                        res.status(200).json({ data: newConversation.data });
                    }
                    else {
                        res.status(200).json({ message: "Something went wrong..." });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorId = req.params.tutorid;
                const userId = req.params.userId;
                if (tutorId) {
                    const conversations = yield this.chatCase.getConversations(userId, tutorId);
                    if (conversations === null || conversations === void 0 ? void 0 : conversations.success) {
                        res.status(200).json({ data: conversations.data });
                    }
                    else if (!(conversations === null || conversations === void 0 ? void 0 : conversations.success)) {
                        res.status(200).json({ message: 'Something went wrong...' });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const newMessage = yield this.chatCase.addMessage(data);
                if (newMessage === null || newMessage === void 0 ? void 0 : newMessage.success) {
                    res.status(200).json({ success: true, data: newMessage.data });
                }
                else if (!(newMessage === null || newMessage === void 0 ? void 0 : newMessage.success)) {
                    res.status(200).json({ success: false, message: 'Something went wrong..' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.params.conversationId;
                if (conversationId) {
                    const messages = yield this.chatCase.getMessages(conversationId);
                    if (messages === null || messages === void 0 ? void 0 : messages.success) {
                        res.status(200).json({ data: messages.data });
                    }
                    else if (!(messages === null || messages === void 0 ? void 0 : messages.success)) {
                        res.status(200).json({ message: 'Something went wrong..' });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findTutorById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (userId) {
                    const userFind = yield this.chatCase.findTutorById(userId);
                    if (userFind === null || userFind === void 0 ? void 0 : userFind.success) {
                        res.status(200).json({ success: true, data: userFind.data });
                    }
                    else if (!(userFind === null || userFind === void 0 ? void 0 : userFind.success)) {
                        res.status(200).json({ success: false, message: 'Something went wrong...' });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(200).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    findUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (userId) {
                    const userFind = yield this.chatCase.findUserById(userId);
                    if (userFind === null || userFind === void 0 ? void 0 : userFind.success) {
                        res.status(200).json({ success: true, data: userFind.data });
                    }
                    else if (!(userFind === null || userFind === void 0 ? void 0 : userFind.success)) {
                        res.status(200).json({ success: false, message: 'Something went wrong...' });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(200).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    TrainersForChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findedtrainer = yield this.chatCase.getTutorsForChat();
                if (findedtrainer) {
                    return res.status(200).json({ success: true, findedtrainer });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Trainer not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    userForChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findeduser = yield this.chatCase.getUsersForChat();
                if (findeduser) {
                    return res.status(200).json({ success: true, findeduser });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Users not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = chatController;

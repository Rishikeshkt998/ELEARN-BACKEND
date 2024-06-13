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
const socket_io_1 = require("socket.io");
const messageModel_1 = require("../database/messageModel");
function socketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.ORIGIN || "*",
            methods: ['GET', 'POST']
        }
    });
    let users = [];
    const addUser = (userId, socketId) => {
        !users.some(user => user.userId === userId) &&
            users.push({ userId, socketId });
    };
    const removeUser = (socketId) => {
        users = users.filter(user => user.socketId !== socketId);
    };
    const getUser = (userId) => {
        return users.find(user => user.userId === userId);
    };
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("addUser", userId => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });
        socket.on("sendMessage", ({ senderId, recieverId, message, contentType, status }) => {
            const user = getUser(recieverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    message: message,
                    contentType: contentType,
                    status: status
                });
            }
        });
        socket.on("markMessageAsRead", (_a) => __awaiter(this, [_a], void 0, function* ({ messageId, userId }) {
            try {
                yield messageModel_1.messageModel.findByIdAndUpdate(messageId, { status: 'read' });
                const updatedMessage = yield messageModel_1.messageModel.findById(messageId);
                const user = getUser(userId);
                if (updatedMessage && user) {
                    io.to(user.socketId).emit("getMessage", {
                        senderId: updatedMessage.senderId,
                        message: updatedMessage.message,
                        contentType: updatedMessage.contentType,
                        status: updatedMessage.status
                    });
                }
                else if (!updatedMessage) {
                    console.error('Message not found:', messageId);
                }
            }
            catch (error) {
                console.error('Error marking message as read:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.log("a user disconnected");
            removeUser(socket.id);
            io.emit('getUsers', users);
        });
    });
}
exports.default = socketServer;

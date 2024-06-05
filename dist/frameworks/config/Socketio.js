"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
function socketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*",
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
        socket.on("sendMessage", ({ senderId, recieverId, message }) => {
            const user = getUser(recieverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    message: message,
                });
            }
        });
        socket.on('disconnect', () => {
            console.log("a user disconnected");
            removeUser(socket.id);
            io.emit('getUsers', users);
        });
    });
}
exports.default = socketServer;

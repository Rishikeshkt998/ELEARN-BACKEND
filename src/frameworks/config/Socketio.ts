import { Server, Socket } from "socket.io";
import { messageModel } from "../database/messageModel";

interface User {
    userId: string,
    socketId: string,
    online?: boolean
}

function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin:process.env.ORIGIN || "*",
            methods: ['GET', 'POST']
        }
    });
    let users: User[] = []
    const addUser=(userId:string,socketId:string)=>{
        !users.some(user=>user.userId===userId)&&
        users.push({userId,socketId})
    }
    const removeUser = (socketId: string) => {
        users = users.filter(user => user.socketId!== socketId);
        
    }
    const getUser = (userId: string) =>{
        return users.find(user => user.userId=== userId);
    }
   
    io.on("connection",(socket)=>{
        console.log("a user connected")
        socket.on("addUser",userId=>{
            addUser(userId,socket.id)
            io.emit("getUsers",users)
            

        })

        socket.on("sendMessage",({senderId,recieverId,message,contentType,status})=>{
            const user = getUser(recieverId)
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    message: message,
                    contentType:contentType,
                    status:status

                });
            }
            

        })
        socket.on("markMessageAsRead", async ({ messageId, userId }) => {
            try {
                await messageModel.findByIdAndUpdate(messageId, { status: 'read' });
                const user = getUser(userId);
                if (user) {
                    io.to(user.socketId).emit("messageRead", {
                        messageId: messageId,
                        userId: userId
                    });
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log("a user disconnected")
                removeUser(socket.id)
                io.emit('getUsers', users)
                
            });
    })
    

    
}

export default socketServer;

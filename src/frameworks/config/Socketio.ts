import { Server, Socket } from "socket.io";

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

        socket.on("sendMessage",({senderId,recieverId,message})=>{
            const user = getUser(recieverId)
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    message: message,

                });
            }
            

        })
        socket.on('disconnect', () => {
            console.log("a user disconnected")
                removeUser(socket.id)
                io.emit('getUsers', users)
                
            });
    })
    

    
}

export default socketServer;

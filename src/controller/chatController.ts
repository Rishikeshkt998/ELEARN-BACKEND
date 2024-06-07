import { Request, Response } from "express";
import chatUseCase from "../useCase/chatUseCase";
class chatController {
    private chatCase: chatUseCase
    constructor(chatCase: chatUseCase) {
        this.chatCase = chatCase
    }
    async newConversation(req: Request, res: Response) {
        try {

            const { senderId, receiverId } = req.body
            if (senderId && receiverId) {
                const newConversation = await this.chatCase.newConversation(senderId, receiverId);
                if (newConversation?.success) {
                    res.status(200).json({ data: newConversation.data });
                } else {
                    res.status(200).json({ message: "Something went wrong..." });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async getConversation(req: Request, res: Response) {
        try {
            const tutorId = req.params.tutorid
            const userId=req.params.userId
            if (tutorId) {
                const conversations = await this.chatCase.getConversations(userId,tutorId);
                if (conversations?.success) {
                    res.status(200).json({ data: conversations.data })
                } else if (!conversations?.success) {
                    res.status(200).json({ message: 'Something went wrong...' })
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    async addMessage(req: Request, res: Response) {
        try {
            const data = req.body;
            const newMessage = await this.chatCase.addMessage(data)
            if (newMessage?.success) {
                res.status(200).json({ success: true, data: newMessage.data })
            } else if (!newMessage?.success) {
                res.status(200).json({ success: false, message: 'Something went wrong..' })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    async getMessages(req: Request, res: Response) {
        try {
            const conversationId = req.params.conversationId
            if (conversationId) {
                const messages = await this.chatCase.getMessages(conversationId)
                if (messages?.success) {
                    res.status(200).json({ data: messages.data })
                } else if (!messages?.success) {
                    res.status(200).json({ message: 'Something went wrong..' });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }







    async findTutorById(req: Request, res: Response) {
        try {
            const userId = req.params.userId 
            if(userId){
                const userFind = await this.chatCase.findTutorById(userId)
                if (userFind?.success) {
                    res.status(200).json({ success: true, data: userFind.data })
                } else if (!userFind?.success) {
                    res.status(200).json({ success: false, message: 'Something went wrong...' })
                }

            }
            
        } catch (error) {
            console.log(error)
            res.status(200).json({ success: false, message: 'Internal server error' });
        }
    }
    async findUserById(req: Request, res: Response) {
        try {
            const userId = req.params.userId
            if (userId) {
                const userFind = await this.chatCase.findUserById(userId)
                if (userFind?.success) {
                    res.status(200).json({ success: true, data: userFind.data })
                } else if (!userFind?.success) {
                    res.status(200).json({ success: false, message: 'Something went wrong...' })
                }

            }

        } catch (error) {
            console.log(error)
            res.status(200).json({ success: false, message: 'Internal server error' });
        }
    }
    async TrainersForChat(req: Request, res: Response) {
        try {
            const findedtrainer = await this.chatCase.getTutorsForChat()
            if (findedtrainer) {
                return res.status(200).json({ success: true, findedtrainer })
            } else {
                return res.status(401).json({ success: false, message: 'Trainer not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async userForChat(req: Request, res: Response) {
        try {
            const findeduser = await this.chatCase.getUsersForChat()
            if (findeduser) {
                return res.status(200).json({ success: true, findeduser })
            } else {
                return res.status(401).json({ success: false, message: 'Users not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }




    // async accessChat(req: Request, res: Response) {
    //     try {
    //         const { trainerId } = req.body
    //         const currentUser = req.userId;

    //         if (!trainerId) return res.json({ success: false, message: 'userId is undefined' })
    //         if (!currentUser) return res.json({ success: false, message: 'user is not logined' })

    //         const chat = await this.chatCase.accessChat(trainerId, currentUser);

    //         if (chat.length > 0) {
    //             console.log(chat[0]);
    //             res.send({ success: true, data: chat[0], message: 'Success' });
    //         } else {
    //             var chatData = {
    //                 chatName: "sender",
    //                 isGroupChat: false,
    //                 users: [currentUser, trainerId]
    //             }
    //             const FullChat = await this.chatCase.saveChat(chatData);
    //             res.json({ success: true, data: FullChat, message: 'Success' });
    //         }
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async fetchChats(req: Request, res: Response) {
    //     try {
    //         const userId = req.userId;
    //         if (userId) {
    //             const chat = await this.chatCase.getChat(userId);
    //             if (chat) res.json({ success: true, data: chat, message: 'successful' });
    //             else res.json({ success: false, message: 'Somthing went wrong!' })
    //         }
    //     } catch (error) {
    //         console.log(error as Error);
    //         res.json({ success: false, message: 'INternal server Error' });
    //     }
    // }
    // async createGroupchat(req: Request, res: Response) {
    //     try {
    //         let { name, users } = req.body;
    //         if (!name || !users) return res.json({ success: false, message: 'Please enter the fields' });

    //         let user = JSON.parse(users);
    //         if (user.length < 2) return res.json({ success: false, message: 'More than 2 users are required to form a group chat' });
    //         user.push(req.user);

    //         const newGroupchat = await this.chatCase.createGroupChat(name, user, req.user);
    //         if (newGroupchat) res.json({ success: true, data: newGroupchat, message: 'successful' });
    //         else res.json({ success: false, message: 'Something went  wrong' });
    //     } catch (error) {
    //         console.log(error as Error)
    //         res.json({ success: false, message: 'Internal server error' });
    //     }
    // }
    // async renameGroup(req: Request, res: Response) {
    //     try {
    //         const { chatId, chatName } = req.body;
    //         const result = this.chatCase.renameGroup(chatId, chatName);
    //         if (!result) res.json({ success: false, message: 'Chat not found!' })
    //         else res.json({ success: true, data: result, message: 'successful' });
    //     } catch (error) {
    //         console.log(error as Error);
    //         res.json({ success: false, message: 'Internal server error' });
    //     }
    // }
    // async addToGroup(req: Request, res: Response) {
    //     try {
    //         const { chatId, userId } = req.body;
    //         if (!chatId || !userId) return res.json({ success: false, message: 'please enter the input fields!' });
    //         const result = await this.chatCase.addToGroup(chatId, userId);
    //         if (result) res.json({ success: true, data: result, message: 'successful' });
    //         else res.json({ success: false, message: 'Something went wrong while adding a new user.' });
    //     } catch (error) {
    //         console.log(error as Error);
    //         res.json({ success: false, message: 'internal server Error' });
    //     }
    // }
    // async removeFromGroup(req: Request, res: Response) {
    //     try {
    //         const { chatId, userId } = req.body;
    //         const result = await this.chatCase.removeFromGroup(chatId, userId);
    //         if (result) res.json({ success: true, data: result, message: 'Successful' });
    //         else res.json({ success: false, message: 'Something went wrong..' });
    //     } catch (error) {
    //         console.log(error as Error)
    //         res.json({ success: false, message: 'internal server error' });
    //     }
    // }
    // async getAllUsers(req: Request, res: Response) {
    //     try {
    //         const userId = req.userId;
    //         if (userId) {
    //             const search: any = req.query.search
    //             console.log(search);
    //             const result = await this.chatCase.getAllUsers(search, userId)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    


}

export default chatController 
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

}

export default chatController 
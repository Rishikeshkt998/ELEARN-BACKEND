import Message from "../domain_entities/message";
import IchatRepository from "./interface/IchatRepository";


class chatUseCase {
    private iChatRepository: IchatRepository
    

    constructor(
        iChatRepository: IchatRepository,
        
    ) {
        this.iChatRepository = iChatRepository;
         
    }
    
    async newConversation(senderId: string, receiverId: string) {
        try {
            const newConversation = await this.iChatRepository.save(senderId, receiverId);
            if (newConversation) {
                return { success: true, data: newConversation }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    async getConversations(userId:string,tutorId: string) {
        try {
            const conversation = await this.iChatRepository.getConversations(userId,tutorId)
            if (conversation) {
                return { success: true, data: conversation }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    async getMessages(conversationId: string) {
        try {
            const messages = await this.iChatRepository.getMessages(conversationId)
            if (messages) {
                return { success: true, data: messages }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async addMessage(data: Message) {
        try {
            const newMessage = await this.iChatRepository.addMessage(data)
            if (newMessage) {
                return { success: true, data: newMessage }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async readMessage(id:any) {
        try {
            const readMessage = await this.iChatRepository.ReadMessage(id)
            if (readMessage) {
                return { success: true, data: readMessage }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    async findTutorById(userId: string) {
        try {
            const userFind = await this.iChatRepository.findTutorById(userId)
            if (userFind) {
                return { success: true, data: userFind }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async findUserById(userId: string) {
        try {
            const userFind = await this.iChatRepository.findUserById(userId)
            if (userFind) {
                return { success: true, data: userFind }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.log(error)
        }
    }
    async getTutorsForChat(id:any) {
        try {
            const trainer = await this.iChatRepository.findTutorForchat(id)
            if (trainer) {
                return trainer
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async getUsersForChat(id:any) {
        try {
            const users = await this.iChatRepository.findUserForChat(id)
            if (users) {
                return users
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }






    // async accessChat(userId: string, current_userId: string) {
    //     try {
    //         return await this.iChatRepository.accessChat(userId, current_userId);
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async saveChat(chatData: { chatName: string, isGroupChat: boolean, users: string[] }) {
    //     try {
    //         return this.iChatRepository.saveChat(chatData);
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async getChat(userId: string) {
    //     return this.iChatRepository.getChat(userId);
    // }
    // async createGroupChat(name: string, users: any, groupAdmin: any) {
    //     try {
    //         return await this.iChatRepository.createGroupChat(name, users, groupAdmin);
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async renameGroup(chatId: string, chatName: string) {
    //     try {
    //         return this.iChatRepository.renameGroup(chatId, chatName);
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async addToGroup(chatId: string, userId: string) {
    //     try {
    //         return await this.iChatRepository.addToGroup(chatId, userId);
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    // async removeFromGroup(chatId: string, userId: string) {
    //     try {
    //         return await this.iChatRepository.removeFromGroup(chatId, userId)
    //     } catch (error) {
    //         console.log(error as Error)
    //     }
    // }
    // async getAllUsers(search: string | undefined, userId: string) {
    //     try {
    //         this.iChatRepository.getAllUsers(search, userId)
    //     } catch (error) {
    //         console.log(error as Error);
    //     }
    // }
    

};






export default chatUseCase 
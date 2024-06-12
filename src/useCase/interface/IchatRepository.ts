import Message from "../../domain_entities/message";
import Trainer from "../../domain_entities/trainer";
import User from "../../domain_entities/user";


interface IchatRepository {
    save(senderId: string, receiverId: string): Promise<any>,
    getConversations(userId:string,tutorId: string): Promise<any>,
    findTutorById(userId: string): Promise<any>,
    findUserById(userId: string): Promise<any>,
    getMessages(conversationId: string): Promise<any>,
    addMessage(data: Message): Promise<any>,
    ReadMessage(id:any):Promise<any>,
    addImageMessage(conversationId: string, sellerId: string, image: string): Promise<any>,
    findTutorForchat(): Promise<Trainer[]>
    findUserForChat(): Promise<User[]>



    // accessChat(userId: string, current_userId: string): Promise<any>
    // saveChat(chatData: any): Promise<any>
    // getChat(userId: string): Promise<any>
    // createGroupChat(name: any, users: any, groupAdmin: any): Promise<any>
    // renameGroup(chatId: string, chatName: string): Promise<any>
    // addToGroup(chatId: string, userId: string): Promise<any>
    // removeFromGroup(chatId: string, userId: string): Promise<any>
    // getAllUsers(search: string | undefined, userId: string): Promise<any>


 

    


}
export default IchatRepository
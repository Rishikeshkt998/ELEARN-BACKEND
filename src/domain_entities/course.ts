interface prerequisite {
    title: string;
   
}
interface benefits {
    title: string;
    
}
interface Meeting{
    meetingDate?: string,
    meetingTime?: string,
    meetingCode?: string,
    description?: string
}
interface Reviews {
    userId?: string,
    comments?: string,
    rating?: string,
    createdAt?: Date,
    commentreplies:string[];
}
interface Course{
    _id?: string;
    category: string;
    price: number;
    estimatedPrice:number;
    name: string;
    instructor?: string;
    instructorId?: string;
    instructorName?: string;
    description: string;
    level:Number;
    tags?: string;
    prerequisite:prerequisite[];
    benefits:benefits[]
    demoUrl?:String,
    thumbnail?: string;
    chapters?: string[],
    approved?: Boolean,
    listed?: Boolean,
    image?: string
    adminVerified?: boolean,
    isPurchased?: boolean,
    publish?: boolean
    rating?: number;
    noOfPurchase?: number
    isDeleted:Boolean 
    meeting?: Meeting,
    reviews?:Reviews[];
    createdAt?:Date;
    questions?:[];                                                                                  

}
export default Course


interface Lesson {
    _id?: string;
    title: string;
    description:string;
    videoUrl:string;
    order?: number;         
    duration?: number;      
    content?: string;       
    resources?: string[];
    chapterId: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export default Lesson
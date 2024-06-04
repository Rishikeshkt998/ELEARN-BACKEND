


interface Order {
    
    courseId:string;
    userId:string;
    payment_info?:object;
    createdAt?:Date
}
export default Order
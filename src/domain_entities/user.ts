interface User{
    _id?:string;
    name:string;
    email:string;
    password:string,
    phone?:string,
    profileimage?: any;
    otp?:string;
    isVerified?:boolean,
    isBlocked?:boolean,
    courseIds?:[],
    createdAt?:Date
    
}


export default User
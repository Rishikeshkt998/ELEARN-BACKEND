import mongoose,{Schema} from 'mongoose';
import User from '../../domain_entities/user';

const userSchema:Schema<User>=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    phone: {
        type: String,
        required: true

    },
    password:{
        type:String,
        required:true

    },
    profileimage:{
        type: String,
        default: "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gAAAA?rs=1&pid=ImgDetMain"

    },
    otp:{
        type: String,  
    },
    isVerified:{
        type:Boolean

    },
    isBlocked:{
        type:Boolean,
        default:false

    },
    createdAt:{
        type: Date,
        default: Date.now()

    },
    courseIds: [
        {
            type: String,
            ref: "course",
        },
    ],
})
const userModel=mongoose.model<User>('user',userSchema)
export {userModel}
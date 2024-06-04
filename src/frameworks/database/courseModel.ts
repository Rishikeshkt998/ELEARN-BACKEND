import mongoose, { Schema } from 'mongoose';
import Course from '../../domain_entities/course'

const courseSchema: Schema<Course> = new Schema({
    name: {
        type: String,
        required:[true,"please give a valid name"],
        min:[3,"name should be atleast 3"]

    },
    description: {
        type: String,
        required: [true, "please give a valid description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "please give a valid price"],
        trim: true,
    },
    estimatedPrice: {
        type: Number,
        required: [true, "please give a valid price"],
        trim: true,
    },
    category: {
        type: String,
        min: [3, "name should have atleast 3 charactor"],
        required: [true, "please give a valid category"],
        trim: true,
    },
    
    instructorId: {
        type: String,
    },
    
    tags: {
        type: String,
        
    },
    level:{
        type:Number
    },
    demoUrl:{
        type:String
    },
    thumbnail: {
        type: String,
        
    },
    benefits:[{
        title:{
            type:String
        }

    }],
    prerequisite:[{
        title: {
            type: String
        }

    }],
    chapters: {
        type: Schema.Types.ObjectId,
        ref: 'chapter',
    },

    image:{
        type:String
    },
    adminVerified:{
        type:Boolean,
        default:false,
    },
    rating:{
        type:Number
    },
    noOfPurchase:{
        type:Number
    },
    approved: {
        type: Boolean,
        default: false,
    },
    listed: {
        type: Boolean,
        default: true,
    },
    publish: {
        type: Boolean,
        default: false,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isPurchased:{
        type: Boolean,
        default: false

    },
    createdAt: {
        type: Date, default: Date.now
    },
    reviews: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
            comments: {
                type: String,
                required: true,

            },
            rating: {
                type: Number
            },
            commentreplies:[
                {
                    type:String
                }

            ],
            createdAt: {
                type: Date, default: Date.now
            }
        },
    ],
    meeting: {
        meetingDate: String, 
        meetingTime: String, 
        meetingCode: String,
        description: String
    },
    questions: [
        {
            type: String,
            ref: "question",
        },
    ],

});


const courseModel = mongoose.model<Course>('course', courseSchema)
export { courseModel }

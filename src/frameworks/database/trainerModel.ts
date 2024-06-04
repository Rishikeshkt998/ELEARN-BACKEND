import mongoose, { Schema } from 'mongoose';
import Trainer from '../../domain_entities/trainer';

const trainerSchema: Schema<Trainer> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    phone: {
        type: String,
        required: true

    },
    dateOfBirth:{
        type: Date,
        required:true

    },
    image:{
        type:String

    },
    password: {
        type: String,
        required: true

    },
    otp: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false

    },
  
    isVerified:{
        type:Boolean,
        default:false

    },
    creationTime:{
        type: Date,
    }
})
const trainerModel = mongoose.model<Trainer>('trainer', trainerSchema)
export { trainerModel }
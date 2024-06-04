import mongoose, { Schema } from 'mongoose';
import Category from '../../domain_entities/category';

const categorySchema: Schema<Category> = new Schema({
    name: {
        type: String,
        required: true

    },
    description: {
        type: String,
        required: true

    },
    isHidden:{
        type: Boolean,
        default:false 
    },
    nooOfcourses:{
        type:Number
    },
    status:{
        type:String,
        default:"active"

    }


})
const categoryModel = mongoose.model<Category>('category', categorySchema)
export { categoryModel }
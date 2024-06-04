import mongoose, { Schema } from 'mongoose';
import Order from '../../domain_entities/order';

const orderSchema: Schema<Order> = new Schema({
        courseId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true,
        },
        payment_info: {
            type: Object,
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
        





    })
const orderModel = mongoose.model<Order>('order', orderSchema)
export { orderModel }

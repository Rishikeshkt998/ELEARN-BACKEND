import mongoose, { Schema } from 'mongoose';
import Admin from '../../domain_entities/admin';

const adminSchema: Schema<Admin> = new Schema({
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },

})
const adminModel = mongoose.model<Admin>('admin', adminSchema)
export { adminModel }
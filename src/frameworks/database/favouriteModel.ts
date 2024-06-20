import mongoose, { Schema, Document } from 'mongoose';
import Favourites from '../../domain_entities/favourites';

const favouriteSchema: Schema<Favourites> = new Schema({
    studentId: {
        type: String,
        required: true
    },
    favourites: [
        {
            type: String,
            ref: "course",
        },
    ],
});
const favouriteModel = mongoose.model<Favourites>('favourite', favouriteSchema);
export { favouriteModel };
import mongoose, { Schema } from 'mongoose';
import Question from '../../domain_entities/question';


const questionSchema: Schema<Question> = new Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOption: {
        type: Number,
        required: true
    },
    courseId: {
        type: String,
        required: true
    }
});

const questionModel = mongoose.model<Question>('question', questionSchema);
export { questionModel };




import mongoose, { Schema } from 'mongoose';
import EnrolledCourse from '../../domain_entities/enrolledStudents';

const enrolledStudentsSchema: Schema<EnrolledCourse> = new Schema({

    courseId: {
        type: String,
        ref: "course",
        
    },
    studentId: {
        type:String,
        ref: "user",
        
    },
    enrolledTime:{
        type: Date,
        default: Date.now,
    },
    completedLessons: [
        {
            type: String,
            ref: "Chapter",
        },
    ],
    completedChapters: [
        {
            type: String,
            ref: "Chapter",
        },
    ],
    attendedQuestions: [
        {
            type: String,
            ref: "Chapter"
        },
    ],
    attendedWrongQuestions: [
        {
            type: String,
            ref: "Chapter"
        },
    ],
    completedDate: {
        type: Date,
        default: 0
    },
    courseStatus: {
        type: Boolean,
        default: false
    }

    

});


const enrolledStudentsModel = mongoose.model<EnrolledCourse>('enrolledstudents', enrolledStudentsSchema)
export { enrolledStudentsModel }

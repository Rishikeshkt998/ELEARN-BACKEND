import mongoose from "mongoose";

interface EnrolledStudents {
    courseId: string;
    studentId: string;
    enrolledTime:Date;
    completedChapters: []
    completedLessons: [];
    attendedQuestions?:[];
    attendedWrongQuestions?:[]
    completedDate?:Date;
    courseStatus?:Boolean
}
export default EnrolledStudents
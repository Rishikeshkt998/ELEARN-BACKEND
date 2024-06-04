interface EnrolledStudents {
    courseId: string;
    studentId: string;
    enrolledTime:Date;
    completedChapters: []
    completedLessons: [];
    attendedQuestions?:[];
    completedDate?:Date;
    courseStatus?:Boolean
}
export default EnrolledStudents
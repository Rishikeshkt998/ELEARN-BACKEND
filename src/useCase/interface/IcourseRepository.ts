import Chapter from "../../domain_entities/chapters"
import Category from "../../domain_entities/category"
import Course from "../../domain_entities/course"
import Question from "../../domain_entities/question"
import Trainer from "../../domain_entities/trainer"
import EnrolledStudents from "../../domain_entities/enrolledStudents"


interface IcourseRepository {
    courseAdd(formData:string): Promise<any>
    courseContentAdd(CourseContentData: any): Promise<any>
    courseEdit(id:string,formData: any): Promise<any>
    courseContentEdit(courseId:string,CourseContentData: any): Promise<any>
    findCategories(): Promise<Category[]>,
    findCourses(): Promise<Course[]>,
    findCoursesView(): Promise<Course[]>,
    findCoursestutor(id:string): Promise<Course[]>,
    ChapterAdd(title:string,id:string,order:string): Promise<any>,
    // LessonAdd(formData: string): Promise<any>,
    getChapterbyId(id:string): Promise<Chapter[]|null>,
    findEditCoursebyId(id: string): Promise<any>
    findChaptersForEdit(id: string): Promise<any>
    publishById(id:string):Promise<any>
    deleteById(id:string):Promise<any>
    reviewAdd(id: string, courseId: string, reviews: string,rating:number): Promise<any>,
    reviewEdit(id: string, courseId: string, reviews: string, rating: number): Promise<any>,
    reviewFetch(id: string): Promise<any>,
    AddReply(reviewId:string, replyText:string): Promise<any>,
    findEnrolledCourses(id: string,usersId:string): Promise<any>
    SearchCourses(search: string,category:string,price:string): Promise<any>
    getTotalCounts():Promise<any>,
    getTotalCountsTutor(id: string): Promise<any>,
    CourseDataforAnalysis():Promise<any>
    UserDataforAnalysis(): Promise<any>
    OrderDataforAnalysis(): Promise<any>
    CourseDataAnalysisTutor(id:string): Promise<any>
    OrderDataAnalysisForTutor(id:string): Promise<any>
    UserDataAnalysisForTutor(id:string): Promise<any>
    QuestionAdd(question: string, options: string[], correctOption: number, courseId: string): Promise<Question>
    Getquestions(courseId: string): Promise<Question[] | null>;
    QuestionAnswer(questionId: string, answer: number, courseId: string, studentId: string): Promise<boolean>
    isCourseCompleted(courseId: string,studentId: string): Promise<any>
    
}
export default IcourseRepository
import Course from '../../domain_entities/course'
import User from '../../domain_entities/user'

interface IuserRepository{
    findByEmail(email:string):Promise<any|null>
    findById(userId: string): Promise<User | null>
    findEmailById(id: string): Promise<any>
    saveUser(user:User):Promise<User|null>
    verifyUser(userId: string):Promise<any>
    updateOtp(email: string,otp:string): Promise<any>
    verifyGoogleUser(email: string): Promise<any>
    updateUser(email:string,otp: string): Promise<any>
    updateEmail(id:string,email: string, otp: string): Promise<any>
    savehashPasssword(email: string, hashpassword: string): Promise<any>
    findProfile(id: string): Promise<any>
    ProfileEdit(id: string): Promise<any>
    updateUserProfile(id: string, user: User): Promise<any>
    savehashPassswordbyId(id: string, hashpassword: string): Promise<any>
    saveimage(id: string,image:string): Promise<any>
    findCourseDeatailsbyId(id: string): Promise<any>
    findCourseForAccess(id: string): Promise<any>
    updateOrder(id:string,courseId:string,payment_Info:any):Promise<any>
    updateStudentsCourse(id: string, courseId: string): Promise<any>
    addEnrolled(id:string,courseId:string):Promise<any>
    isEnrolled(id:string,courseId:string):Promise<any>
    CompletedLessonView(id: string,userId:string): Promise<any>
    CompletedChapterView(id: string,userId:string): Promise<any>
    CompletedLesson(id: string,lessonId:string,userId:string): Promise<any>
    CompletedChapter(id: string, chapterId: string,userId:string): Promise<any>
    findEnrolledCourses(id:string): Promise<any>
    findUser(id:string):Promise<any>




    


}
export default IuserRepository
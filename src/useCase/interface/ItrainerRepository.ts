import Trainer from "../../domain_entities/trainer"

interface ItrainerRepository {
    findTrainerByEmail(email: string): Promise<Trainer | null>
    findByEmailTutor(email: string): Promise<any>
    findTrainerById(id: string): Promise<Trainer | null>
    findTutorById(tutorId: string): Promise<Trainer | null>
    verifyTutor(tutorId: string): Promise<any>
    updateTrainerOtp(email: string, otp: string): Promise<any>
    saveTrainer(admin: Trainer): Promise<Trainer | null>
    updateTutor(email: string, otp: string): Promise<any>
    savehashPasssword(email: string, hashpassword: string): Promise<any>
    findTrainerProfile(id: string): Promise<any>
    TrainerProfileEdit(id: string): Promise<any>
    updateTrainerProfile(id: string, trainer: Trainer): Promise<any>
    savehashPasswordbyId(id: string, hashpassword: string): Promise<any>
    Trainersaveimage(id: string, image: string): Promise<any>
    findEnrolledStudents(): Promise<any>
    Shedulemeeting(id:string,meetingDate:string, meetingTime:string, meetingCode:string, description:string):Promise<any>
    findCoursesTutor():Promise<any>

}
export default ItrainerRepository
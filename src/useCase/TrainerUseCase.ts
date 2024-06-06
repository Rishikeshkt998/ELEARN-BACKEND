import Trainer from "../domain_entities/trainer";
import ItrainerRepository from "./interface/ItrainerRepository";
import JwtToken from "../frameworks/services/JwtToken";
import HashPassword from "../frameworks/services/hashPassword";
import Cloudinary from "../frameworks/services/Cloudinary";
import GenerateOtp from "../frameworks/services/GenerateOtp";
import sendMail from "../frameworks/services/SendMail";
import jwt from "jsonwebtoken";



class TrainerUseCase {
    private ItrainerRepository:ItrainerRepository
    private JwtToken: JwtToken
    private HashPassword: HashPassword
    private Cloudinary: Cloudinary
    private GenerateOtp: GenerateOtp
    private sendMail: sendMail
   
    

    constructor(
        ItrainerRepository: ItrainerRepository,
        JwtToken: JwtToken,
        HashPassword: HashPassword,
        Cloudinary: Cloudinary, 
        GenerateOtp: GenerateOtp, 
        sendMail: sendMail
        
    ) {
        this.ItrainerRepository = ItrainerRepository,
        this.JwtToken = JwtToken
        this.HashPassword = HashPassword
        this.Cloudinary = Cloudinary
        this.GenerateOtp = GenerateOtp
        this.sendMail = sendMail
  
    }
    async TrainerSignUp(trainer:Trainer) {
        try {
            const email = trainer.email;
            const isTrainer = await this.ItrainerRepository.findTrainerByEmail(email)
            if(isTrainer) {
                return { success: false, message: 'This Email is already exists' };
            } else {
                const hashedPassword = await this.HashPassword.Hashing(trainer.password);
                trainer.password = hashedPassword;

                const otp = await this.GenerateOtp.generateOtp(4);
                console.log(otp)
                trainer.otp = otp
                this.sendMail.SendMail(trainer.name, trainer.email, otp);
                const trainerSave = await this.ItrainerRepository.saveTrainer(trainer)

                if (!trainerSave) {
                    return { success: false, message: 'Something went wrong while saving trainer data' };
                } else {
                    return { success: true, message: 'trainer successfully registered,wait for admin to verify this account', trainerSave };
                }
            }
        } catch (error) {
            console.log('trainer signup error in UserUseCase:', error);
            return { success: false, message: 'Internal server error' };
        }
    }
    async VerifyTutor(otp: string, tutorId: string) {
        const tutorData: any = await this.ItrainerRepository.findTutorById(tutorId)
        if (otp === tutorData?.otp) {
            const updated = await this.ItrainerRepository.verifyTutor(tutorId)
            return { success: true, message: 'email verification successfull,wait for admin to verify this account' ,updated}

        } else {
            return { success: false, message: 'invalid otp' }

        }

    }
    async resendOtpTrainer(email: string) {
        try {
            const Realotp = await this.GenerateOtp.generateOtp(4);
            const saveotp = await this.ItrainerRepository.updateTrainerOtp(email, Realotp)
            this.sendMail.SendMail(email, email, Realotp);

            return Realotp
        }
        catch (error) {
            console.log(error);
        }
    }

    async LoginTrainer(email: string, password: string) {
        try {
            const trainerData: any = await this.ItrainerRepository.findTrainerByEmail(email)
            if (trainerData) {
                const matched = await this.HashPassword.Compare(password, trainerData.password)
                if (!matched) {
                    return { success: false, message: "Incorrect password" };
                    

                } else if (!trainerData.isVerified) {
                    return { success: false, message: 'tutor is not verified by the admin' }
                }else {
                    const token = await this.JwtToken.SignJwt(trainerData._id as string, "trainer")
                    // const token = await this.JwtToken.SignJwt(trainerData)

                    return { success: true, adminData: trainerData, token: token }

                }
            } else {
                return { success: false, message: 'email is not valid' }
            }

        } catch (error) {
            console.log(error)

        }

    }
    async forgotPasswordTutor(email: string) {
        try {
            const trainerfind = await this.ItrainerRepository.findTrainerByEmail(email)
            if(trainerfind?.isVerified===false){
                return { success: false, message: 'tutor is not verified by the admin' }

            }
            const otp = await this.GenerateOtp.generateOtp(4)
            const sendmail = this.sendMail.SendMail(email, email, otp)
            const update = await this.ItrainerRepository.updateTutor(email, otp)
            return { success: true, email, otp }



        } catch (error) {
            console.log(error)
        }


    }

    async VerifyforgotTutor(email: string, otp: "string") {
        try {
            console.log("email",email,otp)

            const tutorData: Trainer | null = await this.ItrainerRepository.findByEmailTutor(email);


            if (!tutorData) {
                throw new Error('User not found');
            }

            if (tutorData.otp === otp) {
                return { success: true, message: "Password successfully verified with OTP" };
            } else {
                return { success: false, message: "Invalid OTP" };
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, message: "Error verifying OTP: " + error };
        }
    }
    async changePasswordTutor(email: string, newpassword: string, confirmpassword: string) {
        try {
            if (newpassword !== confirmpassword) {
                return { success: false, message: 'New password and confirm password do not match' };
            }
            const tutorData: Trainer | null = await this.ItrainerRepository.findTrainerByEmail(email);

            if (!tutorData) {
                return { success: false, message: 'User not found' };
            }
            const hashpassword = await this.HashPassword.Hashing(newpassword)
            tutorData.password = hashpassword
            const saveTutor = await this.ItrainerRepository.savehashPasssword(email, hashpassword);
            return { success: true, message: "password changed successfully", saveTutor }

        } catch (error) {
            console.log(error)
        }


    }

    async trainerProfile(id: string) {
        try {
            const trainerData = await this.ItrainerRepository.findTrainerProfile(id)
            return trainerData

        } catch (error) {
            console.error(error)
        }
    }

    async trainerprofileedit(id: string) {
        try {
            const trainerData = await this.ItrainerRepository.TrainerProfileEdit(id)
            return trainerData
        } catch (error) {
            console.error(error)

        }

    }
    async updateTrainerProfile(id: string,trainer: Trainer) {
        try {
            let trainerExists = await this.ItrainerRepository.findTrainerById(id)

            let response = await this.ItrainerRepository.updateTrainerProfile(id,trainer)
            return response

        } catch (error) {
            console.log(error)
        }
    }


    async ChangeTrainerPassword(id: string, oldpassword: string, newpassword: string, confirmpassword: string) {
        try {
            if (newpassword !== confirmpassword) {
                return { success: false, message: 'New password and confirm password do not match' };
            }

            const trainerData: any = await this.ItrainerRepository.findTrainerById(id)

            if (!trainerData) {
                return { success: false, message: 'User not found' };
            }

            const isOldPasswordCorrect = await this.HashPassword.Compare(oldpassword, trainerData.password);

            if (!isOldPasswordCorrect) {
                return { success: false, message: 'Incorrect old password' };
            }

            const hashedNewPassword = await this.HashPassword.Hashing(newpassword);

            const saveTrainer = await this.ItrainerRepository.savehashPasswordbyId(id,hashedNewPassword)

            if (!saveTrainer) {
                return { success: false, message: 'Failed to save new password' };
            }

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            console.error('Error changing password:', error);
            return { success: false, message: 'Internal server error' };
        }
    }
    async trainerProfilePicUpdate(id: string, imagePath: string) {
        try {


            const imageUrl = await this.Cloudinary.savetocloudinary(imagePath)
            console.log(imageUrl)


            if (imageUrl) {
                const saveimage = await this.ItrainerRepository.Trainersaveimage(id,imageUrl)
                return { success: true, message: "Image uploaded successfully", imageUrl };
            } else {
                return { success: false, message: "Failed to upload image" };
            }
        } catch (error) {
            console.error("Error during image upload:", error);
            return { success: false, message: "Internal server error" };
        }
    }
    async getEnrolledList(){
        try {
            const EnrolledStudents = await this.ItrainerRepository.findEnrolledStudents()
            if (EnrolledStudents) {
                return EnrolledStudents
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    async MeetingShedule(id:string,meetingDate:string, meetingTime:string, meetingCode:string, description:string) {
        try {
            const shedulemeet = await this.ItrainerRepository.Shedulemeeting(id,meetingDate, meetingTime, meetingCode, description)
            if (shedulemeet) {
                return shedulemeet 
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    
    async showCourseTutor() {
        try {
            const course = await this.ItrainerRepository.findCoursesTutor()

            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }
    }
    


}
export default TrainerUseCase
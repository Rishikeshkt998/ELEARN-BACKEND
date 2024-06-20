import User from "../domain_entities/user";
import IuserRepository from "./interface/IuserRepository";
import JwtToken from "../frameworks/services/JwtToken";
import HashPassword from "../frameworks/services/hashPassword";
import GenerateOtp from "../frameworks/services/GenerateOtp";
import sendMail from "../frameworks/services/SendMail";
import Cloudinary from "../frameworks/services/Cloudinary";
import jwt from "jsonwebtoken";




class UserUseCase {
    private iuserRepository: IuserRepository
    private JwtToken: JwtToken
    private HashPassword: HashPassword
    private GenerateOtp: GenerateOtp
    private sendMail: sendMail
    private Cloudinary: Cloudinary

    constructor(iuserRepository: IuserRepository, JwtToken: JwtToken, HashPassword: HashPassword, GenerateOtp: GenerateOtp, sendMail: sendMail, Cloudinary: Cloudinary) {
        this.iuserRepository = iuserRepository
        this.JwtToken = JwtToken
        this.HashPassword = HashPassword
        this.GenerateOtp = GenerateOtp
        this.sendMail = sendMail
        this.Cloudinary = Cloudinary

    }
    async signupUser(user: User) {
        try {
            const email = user.email;
            const isUser = await this.iuserRepository.findByEmail(email);
            if (isUser) {
                return { success: false, message: "Email already exists" };
            }
            const hashedPassword = await this.HashPassword.Hashing(user.password);
            user.password = hashedPassword;
            const otp = await this.GenerateOtp.generateOtp(4);
            user.otp = otp
            this.sendMail.SendMail(user.name, user.email, otp);
            let token = jwt.sign(
                { user, otp },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "5m" }
            );
            console.log(token)
            const saveUser = await this.iuserRepository.saveUser(user);
            if (saveUser) {
                return { status: 200,success:true, message: "Signup successful", data: saveUser };
            } else {
                return { status: 500, success:false, message: "Failed to save user data" };
            }
        } catch (error) {
            console.error("Error during user signup:", error);
            return { status: 500, message: "Internal server error" };
        }
    }

    async resendOtp(email: string) {
        try {
            const Realotp = await this.GenerateOtp.generateOtp(4);
            const saveotp =await this.iuserRepository.updateOtp(email,Realotp)
            this.sendMail.SendMail(email, email, Realotp);

            return Realotp
        }
        catch(error) {
        console.log(error);
         }
    }

    async VerifyUser(otp: string, userId: string) {
    const userData: any = await this.iuserRepository.findById(userId)
    if (otp === userData?.otp) {
        const updated = await this.iuserRepository.verifyUser(userId)
        return { success: true, message: 'Signup successful..!' ,updated}

    } else {
        return { success: false, message: 'invalid otp' }

    }

}

    async LoginUser(email: string, password: string) {
    try {
        const userData: any = await this.iuserRepository.findByEmail(email)
        if (userData) {
            const matched = await this.HashPassword.Compare(password, userData.password)
            if (!matched) {
                return { success: false, message: "Incorrect password" };
            } else if (userData.isBlocked) {
                return { success: false, message: "User is blocked by admin!" };
            } else {
                const token = await this.JwtToken.SignUserJwt(userData._id as string, "user")
                const Refreshtoken = await this.JwtToken.refreshToken(userData._id as string, "user")

                return { success: true, userData: userData, token: token ,Refreshtoken:Refreshtoken}
            }
        } else {
            return { success: false, message: 'email is wrong' }
        }

    } catch (error) {
        console.log(error)

    }

}
    async forgotPassword(email: string) {
    try {
        const userfind = await this.iuserRepository.findByEmail(email)
        console.log("finded user",userfind)
        if (!userfind) {
            return { success: false, message: 'Email not found' };
        } else {
            const otp = await this.GenerateOtp.generateOtp(4)
            const sendmail = this.sendMail.SendMail(email, email, otp)
            const update = await this.iuserRepository.updateUser(email, otp)
            return { success: true, email, otp }

        }



    } catch (error) {
        console.log(error)
    }


}

    async VerifyforgotUser(email: string, otp: "string") {
    try {

        const userData: User | null = await this.iuserRepository.findByEmail(email);


        if (!userData) {
            return { success: true, message: "user not found" };
        }

        if (userData.otp === otp) {
            return { success: true, message: "Password successfully verified with OTP" };
        } else {
            return { success: false, message: "Invalid OTP" };
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: "Error verifying OTP: " + error };
    }
}
  
    async changePass(email: string, newpassword: string, confirmpassword: string) {
    try {
        if (newpassword !== confirmpassword) {
            return { success: false, message: 'New password and confirm password do not match' };
        }
        const userData: User | null = await this.iuserRepository.findByEmail(email);

        if (!userData) {
            return { success: false, message: 'User not found' };
        }
        const hashpassword = await this.HashPassword.Hashing(newpassword)
        userData.password = hashpassword
        const saveUser = await this.iuserRepository.savehashPasssword(email, hashpassword);
        return { success: true, message: "password changed successfully" }

    } catch (error) {
        console.log(error)
    }


}
    async googleSignin(email: string, name: string) {
    try {
        const userData = await this.iuserRepository.findByEmail(email);
        if (userData) {
            if(userData.isBlocked){
                return { success: false,  message:"user has been blocked by the user" };
            }
            const token = await this.JwtToken.SignJwt(userData._id as string, "user");
            const Refreshtoken = await this.JwtToken.refreshToken(userData._id as string, "user")
            const { password, ...rest } = userData;
            return { success: true, userData: userData, token: token,Refreshtoken:Refreshtoken };
        } else {
            const passwordgenerated = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = await this.HashPassword.Hashing(passwordgenerated);
            const phone='9654321834'
      
            const user = {
                name: name,
                email: email,
                password: hashPassword,
                phone:phone

            };
           
            const newuser = await this.iuserRepository.saveUser(user);
            console.log("new user",newuser)
            const uservalue = await this.iuserRepository.verifyGoogleUser(email);
            const token = await this.JwtToken.SignJwt(uservalue._id as string, "user");
            const Refreshtoken = await this.JwtToken.refreshToken(uservalue._id as string, "user")
            return { success: true, message: 'login successfull!', userData: uservalue ,token:token,Refreshtoken:Refreshtoken };
        }
    } catch (error) {
        console.error(error);

        return { success: false, message: "An error occurred during sign-in" };
    }
}
    async userProfile(id: string) {
    try {
        const userData = await this.iuserRepository.findProfile(id)
        return userData

    } catch (error) {
        console.error(error)
    }
}

    async profileedit(id: string) {
    try {
        const userData = await this.iuserRepository.ProfileEdit(id)
        return userData
    } catch (error) {
        console.error(error)

    }

}
    async updateProfile(id: string, user: User) {
    try {
        let userExists = await this.iuserRepository.findById(id)
        
            let response = await this.iuserRepository.updateUserProfile(id, user)
            return response
       
    } catch (error) {
        console.log(error)
    }
}


    async ChangePassword(id: string, oldpassword: string, newpassword: string, confirmpassword: string) {
        try {
            if (newpassword !== confirmpassword) {
                return { success: false, message: 'New password and confirm password do not match' };
            }

            const userData: any = await this.iuserRepository.findById(id);

            if (!userData) {
                return { success: false, message: 'User not found' };
            }

            const isOldPasswordCorrect = await this.HashPassword.Compare(oldpassword, userData.password);

            if (!isOldPasswordCorrect) {
                return { success: false, message: 'Incorrect old password' };
            }

            const hashedNewPassword = await this.HashPassword.Hashing(newpassword);

            const saveUser = await this.iuserRepository.savehashPassswordbyId(id, hashedNewPassword);

            if (!saveUser) {
                return { success: false, message: 'Failed to save new password' };
            }

            return { success: true, message: 'Password changed successfully' };
        } catch (error) {
            console.error('Error changing password:', error);
            return { success: false, message: 'Internal server error' };
        }
    }
    async profilePicUpdate(id: string, imageUrl: string) {
        try {
            if (imageUrl) {
                const saveimage = await this.iuserRepository.saveimage(id, imageUrl)
                return { success: true, message: "Image uploaded successfully", imageUrl, saveimage };
            } else {
                return { success: false, message: "Failed to upload image" };
            }
        } catch (error) {
            console.error("Error during image upload:", error);
            return { success: false, message: "Internal server error" };
        }
    }
    async EmailChange(id: string, email: string) {
        try {
            
            const oldEmail = await this.iuserRepository.findEmailById(id);

            
            if (oldEmail === email) {
                throw new Error('Old and new email are the same');
            }

            const otp = await this.GenerateOtp.generateOtp(4);
            const sendMailResult = this.sendMail.SendMail(email, email, otp);

            const updateResult = await this.iuserRepository.updateEmail(id,email, otp);

            return { success: true, email: email, otp };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }
    async VerificationEmail(email: string, otp: "string") {
        try {

            const userData: User | null = await this.iuserRepository.findByEmail(email);


            if (!userData) {
                throw new Error('User not found');
            }

            if (userData.otp === otp) {
                return { success: true, message: "email successfully verified with OTP" };
            } else {
                return { success: false, message: "Invalid OTP" };
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return { success: false, message: "Error verifying OTP: " + error };
        }
    }
    async getUserCourse(id:string){
        try {
            const course = await this.iuserRepository.findCourseDeatailsbyId(id)
            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }
    async getUserCourseAccess(id: string) {
        try {
            const course = await this.iuserRepository.findCourseForAccess(id)
            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }
    async addOrders(id:any,courseId:any, payment_Info:any){
        try {
            
            const isEnrolled = await this.iuserRepository.isEnrolled(id, courseId);
            console.log("isEnrolleed",isEnrolled)
            if (isEnrolled) {
                return { success: false, message: 'The student is already enrolled in this course' };
            }
            console.log("myids", id, courseId)
            const updateEnrolledStudents = await this.iuserRepository.addEnrolled(id, courseId);
            console.log(updateEnrolledStudents)
            const course = await this.iuserRepository.findCourseDeatailsbyId(courseId);
            console.log(course)
            if (!course) {
                return { success: false, message: "Course not found" };
            }

            const updatedOrder = await this.iuserRepository.updateOrder(id,courseId, payment_Info);
            const updateUser = await this.iuserRepository.updateStudentsCourse(id,courseId)
            const updateChat = await this.iuserRepository.updateChats(id, courseId)
            const updatewhishlist = await this.iuserRepository.updateWhishlist(id, courseId)



            return { success: true, message: "Order updated successfully", updatedOrder ,updateEnrolledStudents,updateUser,updateChat};
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while processing the order" };
        }
    }
    async ViewCompletedLessons(id: string,userId:string) {
        try {
            const lessoncompletionView = await this.iuserRepository.CompletedLessonView(id,userId);

            return { success: true, message: "lesson view", lessoncompletionView };
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while completeion of lesson" };
        }
    }
    
    async ViewCompletedChapter(id: string,userId:string) {
        try {
            const chaptercompletionView = await this.iuserRepository.CompletedChapterView(id,userId);

            return { success: true, message: "chapter view", chaptercompletionView };
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while completeion of lesson" };
        }
    }
    
    async CompleteLessons(id:string,lessonId:string,userId:string) {
        try {
             const lessoncompletion = await this.iuserRepository.CompletedLesson(id,lessonId,userId);

            return { success: true, message: "lesson completed successfully", lessoncompletion };
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while completeion of lesson" };
        }
    }
    async CompleteChapters(id: string, chapterId: string,userId:string) {
        try {
            const chaptercompletion = await this.iuserRepository.CompletedChapter(id, chapterId,userId);

            return { success: true, message: "lesson completed successfully", chaptercompletion };
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while completeion of lesson" };
        }
    }
    async CompletionTime(id: string,  userId: string) {
        try {
            const chaptercompletiontime = await this.iuserRepository.CompletedChapterTime(id, userId);

            return { success: true, message: "completiontime updated", chaptercompletiontime };
        } catch (error) {
            console.error(error);
            return { success: false, message: "An error occurred while completeion of lesson" };
        }
    }
    async getEnrolledCourseList(id:string) {
        try {
            const EnrolledCourses= await this.iuserRepository.findEnrolledCourses(id)
            if (EnrolledCourses) {
                return EnrolledCourses
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    async finduser(id:string){
        try {
            const user = await this.iuserRepository.findUser(id)
            if (user) {
                return user
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    

}
export default UserUseCase
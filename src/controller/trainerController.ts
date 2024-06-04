import { Request, Response } from "express";
import TrainerUseCase from "../useCase/TrainerUseCase";
import Multer from 'multer'
import {
    HTTP_STATUS_OK,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_INTERNAL_SERVER_ERROR
} from '../frameworks/services/HTTPstatus';
class trainerController {
    private trainerCase: TrainerUseCase
    constructor(trainerCase: TrainerUseCase) {
        this.trainerCase = trainerCase
    }
    async SignUpTrainer(req: Request, res: Response) {
        try {

            let trainerData = req.body
            const trainer = await this.trainerCase.TrainerSignUp(trainerData)
            res.json(trainer)


        } catch (error) {
            console.log('signup error : ', error);

        }
    }
    async verifyOtp(req: Request, res: Response) {
        try {
            const tutorOtp = req.body
            const saveTutor = await this.trainerCase.VerifyTutor(tutorOtp.otp, tutorOtp.id)
            if (saveTutor?.success) {
                return res.status(200).json(saveTutor);
            } else if (!saveTutor?.success) {
                return res.status(HTTP_STATUS_OK).json({ success: false, message: saveTutor?.message });
            }
            // res.json(saveTutor)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!" });
        }
    }
    async resendOtpTrainer(req: Request, res: Response) {

        try {
            const { email } = req.body;

            const isRsendOTP = await this.trainerCase.resendOtpTrainer(email)
            if (isRsendOTP) {
                res.json({ success: true, message: 'Resend OTP successful' ,isRsendOTP})
            } else {
                res.json({ sucess: false, message: 'Resend OTP failed..!' })
            }


        } catch (error) {
            console.log('resend otp error in tutor controller', error);

        }
    }
    async TrainerLogin(req: Request, res: Response) {
        try {

            const { email, password } = req.body
            const trainerData = await this.trainerCase.LoginTrainer(email,password)
            if (trainerData?.success) {
                res.cookie('trainerToken', trainerData.token, { maxAge: 900000, httpOnly: true });
        
                return res.status(200).json(trainerData);
            } else if (!trainerData?.success) {
                return res.status(200).json({ success: false, message: trainerData?.message });
        }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!" });
        }
    }
    async forgotpasswordTutor(req: Request, res: Response) {
        try {
            const { email } = req.body
            const forgot = await this.trainerCase.forgotPasswordTutor(email)
             return res.json(forgot)
                
        
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Internal server error!" });
        }
    }
    async verifyForgotTutorOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body
            const verifyforgott = await this.trainerCase.VerifyforgotTutor(email, otp)
            if (verifyforgott) {
                res.status(HTTP_STATUS_OK).json({ success: true, verifyforgott });

            } else {
                res.status(HTTP_STATUS_OK).json({ success: false });
            }



        } catch (error) {
            console.log(error)
        }

    }
    async changedPaswordTutor(req: Request, res: Response) {
        try {
            const { email, newpassword, confirmpassword } = req.body
            const updatepassword = await this.trainerCase.changePasswordTutor(email, newpassword, confirmpassword)
            res.json(updatepassword)

        } catch (error) {
            console.log(error)
        }

    }
    async TrainerprofilePage(req: Request, res: Response) {
        try {
            const trainerId = req.params.trainerId
            if (trainerId) {
                const trainerprofile = await this.trainerCase.trainerProfile(trainerId)
                if (trainerprofile) {
                    return res.status(200).json({ success: true, trainerprofile })
                } else {
                    return res.status(401).json({ success: true, message: 'authentication error' })
                }
            } else {
                return res.status(401).json({ success: true, message: 'userid not found' })

            }

        } catch (error) {
            console.error(error)
        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const trainerId = req.params.trainerId
            if (trainerId) {
                const profile = await this.trainerCase.trainerprofileedit(trainerId)
                if (profile) {
                    return res.status(200).json({ success: true, profile })
                } else {
                    return res.status(401).json({ success: true, message: 'authentication error' })
                }
            } else {
                return res.status(401).json({ success: true, message: 'userid not found' })

            }

        } catch (error) {
            console.log(error)

        }
    }
    async updatetutorProfile(req: Request, res: Response) {
        try {
            const trainerId = req.params.trainerId
            let trainerData = req.body

            const updatedtrainerprofile = await this.trainerCase.updateTrainerProfile(trainerId, trainerData)

            return res.status(200).json({ success: true, updatedtrainerprofile })



        } catch (error) {
            console.log(error)

        }
    }
    async changePassword(req: Request, res: Response) {

        try {
            const { oldpassword, newpassword, confirmpassword } = req.body;
            const id = req.params.trainerId
            const changedtrainer = await this.trainerCase.ChangeTrainerPassword(id, oldpassword, newpassword, confirmpassword)
            return res.status(200).json({ success: true, changedtrainer })

        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async uploadProfilepic(req: Request, res: Response) {

        try {
            const imageFile: Express.Multer.File | undefined = req.file;
            if (!imageFile) {
                return res.status(400).json({ success: false, message: 'No image uploaded' });
            }

            const imagePath = imageFile.path;
            const id = req.params.id
            const Response = await this.trainerCase.trainerProfilePicUpdate(id, imagePath)
            return res.json(Response)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async EnrolledList(req: Request, res: Response) {
        try {
            const EnrolledStudents = await this.trainerCase.getEnrolledList()
            if (EnrolledStudents) {
                return res.status(200).json({ success: true, EnrolledStudents })
            } else {
                return res.status(401).json({ success: false, message: 'enrolled students  not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
    async SheduleCourse(req: Request, res: Response) {
        try {
            const { id,meetingDate, meetingTime, meetingCode, description } = req.body
            const sheduledcourse = await this.trainerCase.MeetingShedule(id,meetingDate, meetingTime, meetingCode, description)
            if (sheduledcourse) {
                return res.status(200).json({ success: true, sheduledcourse })
            } else {
                return res.status(401).json({ success: false, message: 'enrolled students  not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
    async CourseshowTutor(req: Request, res: Response) {
        try {
            const course = await this.trainerCase.showCourseTutor()
            if (course) {
                return res.status(200).json(course)
            } else {
                return res.status(401).json({ success: false, message: 'course not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async trainerLogout(req: Request, res: Response) {
        try {
            res.cookie("trainerToken", "", {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ success: true })
        } catch (error) {
            console.log(error)
        }
    }
   
}
export default trainerController
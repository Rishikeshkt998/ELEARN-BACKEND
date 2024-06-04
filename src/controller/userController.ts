import { Request, Response } from "express";
import UserUseCase from "../useCase/UserUseCase";
import JWT from '../frameworks/services/JwtToken'
import Multer from 'multer'
import { ParsedQs } from "qs";
import { paymentCheckOut } from "../frameworks/services/Stripe";
import stripeValue from "stripe"
import {
    HTTP_STATUS_OK,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_INTERNAL_SERVER_ERROR
} from '../frameworks/services/HTTPstatus';
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const jwt = new JWT()



class userController {
    private userCase: UserUseCase
    JwtToken: any;
    constructor(userCase: UserUseCase) {
        this.userCase = userCase
    }
    async SignUpUser(req: Request, res: Response) {
        try {
            const userData = req.body
            const user = await this.userCase.signupUser(userData)
            if (user) {
                res.status(HTTP_STATUS_OK).json({ success: true, user });
            } else {
                res.status(200).json({ success: false });

            }




        } catch (error) {
            console.log('signup error : ', error);

        }
    }
    async verifyOtp(req: Request, res: Response) {
        try {
            const userOtp = req.body
            const saveUser = await this.userCase.VerifyUser(userOtp.otp, userOtp.id)
            res.json(saveUser)
        } catch (error) {
            console.log(error)
        }
    }

    async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await this.userCase.LoginUser(email, password);
            if (user?.success) {
                res.cookie('userToken', user.token, {
                    expires: new Date(Date.now() + 300000),
                    httpOnly: true,
                })
                res.cookie('refreshToken', user.Refreshtoken, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                })

                return res.status(200).json(user);
            } else if (!user?.success) {
                return res.status(200).json({ success: false, message: user?.message });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error!" });
        }
    }

    async forgotpassword(req: Request, res: Response) {
        try {
            const { email } = req.body
            const forgot = await this.userCase.forgotPassword(email)
            res.json(forgot)


        } catch (error) {
            console.log(error)
        }
    }
    async verifyForgotOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body
            const verifyforgott = await this.userCase.VerifyforgotUser(email, otp)
            if (verifyforgott) {
                res.status(HTTP_STATUS_OK).json({ success: true, verifyforgott });

            } else {
                res.status(HTTP_STATUS_OK).json({ success: false });
            }



        } catch (error) {
            console.log(error)
        }

    }
    async changedPasword(req: Request, res: Response) {
        try {
            const { email, newpassword, confirmpassword } = req.body
            const updatepassword = await this.userCase.changePass(email, newpassword, confirmpassword)
            res.json(updatepassword)

        } catch (error) {
            console.log(error)
        }

    }

    async googleSignin(req: Request, res: Response) {
        try {
            const { email, name } = req.body
            const googleSigned = await this.userCase.googleSignin(email, name)
            console.log("goo",googleSigned)
            if (googleSigned?.success) {
                res.cookie('userToken', googleSigned.token, {
                    expires: new Date(Date.now() + 300000),
                    httpOnly: true,
                })
                res.cookie('refreshToken', googleSigned.Refreshtoken, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                })
                return res.status(200).json(googleSigned);
            } else if (!googleSigned?.success) {
                return res.status(200).json({ success: false, message: googleSigned?.message });
            }
            res.json(googleSigned)

        } catch (error) {
            console.log(error)
        }

    }

    async profilePage(req: Request, res: Response) {
        try {
            const userId = req.params.userId
            if (userId) {
                const profile = await this.userCase.userProfile(userId)
                if (profile) {
                    return res.status(200).json({ success: true, profile })
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
            const userId = req.params.userId
            if (userId) {
                const profile = await this.userCase.profileedit(userId)
                if (profile) {
                    return res.status(200).json({ success: true, profile })
                } else {
                    return res.status(200).json({ success: false, message: 'user not found' })
                }
            } else {
                return res.status(401).json({ success: true, message: 'userid not found' })

            }

        } catch (error) {
            console.log(error)

        }
    }
    async updateProfile(req: Request, res: Response) {
        try {
            let id = req.params.userId

            let userData = req.body

            const updatedprofile = await this.userCase.updateProfile(id, userData)

            return res.status(HTTP_STATUS_OK).json({ success: true, updatedprofile })



        } catch (error) {
            console.log(error)

        }
    }
    async resendOtp(req: Request, res: Response) {

        try {
            const { email } = req.body;

            const isRsendOTP = await this.userCase.resendOtp(email)
            if (isRsendOTP) {
                res.json({ success: true, message: 'Resend OTP successful' })
            } else {
                res.json({ sucess: false, message: 'Resend OTP failed..!' })
            }


        } catch (error) {
            console.log('resend otp error in userController', error);

        }
    }

    async changePassword(req: Request, res: Response) {

        try {
            const { oldpassword, newpassword, confirmpassword } = req.body;
            const id = req.params.userId
            const changed = await this.userCase.ChangePassword(id, oldpassword, newpassword, confirmpassword)
            return res.status(200).json({ success: true, changed })

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
            const Response = await this.userCase.profilePicUpdate(id, imagePath)
            return res.json(Response)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async changEmail(req: Request, res: Response) {
        try {
            const data = req.body
            const { email } = data
            const id = req.params.id
            const emailchange = await this.userCase.EmailChange(id, email)
            res.json(emailchange)


        } catch (error) {
            console.log(error)
        }
    }
    async ChangeEmailVerification(req: Request, res: Response) {
        try {
            const { email, otp } = req.body
            const changedEmail = await this.userCase.VerificationEmail(email, otp)
            if (changedEmail) {
                res.status(200).json({ success: true, changedEmail });

            } else {
                res.status(200).json({ success: false });
            }



        } catch (error) {
            console.log(error)
        }

    }
    async getUserCousrse(req: Request, res: Response) {
        try {

            const id = req.params.id
            const courseIdCookie = req.cookies.courseId;
            if (!courseIdCookie) {
                const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
                res.cookie('courseId', id, { maxAge: oneDayInMilliseconds, httpOnly: true });
            }
            const Response = await this.userCase.getUserCourse(id)
            if (Response) {
                res.status(200).json({ success: true, message: 'get the userdata', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in getting the course data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getUserCourseAccess(req: Request, res: Response) {
        try {

            const id = req.params.id
            const Response = await this.userCase.getUserCourseAccess(id)
            if (Response) {
                res.status(200).json({ success: true, message: 'get the userdata', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in getting the course data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async SendVideoCallKey(req: Request, res: Response) {
        res.status(200).json({
            appID: process.env.APPID,
            serverSecret: process.env.SERVERSECRET
        })

    }
    async checkoutSession(req: Request, res: Response) {
        try {


            let sessionId = await paymentCheckOut(req.body);
            res.status(200).json(sessionId);
        } catch (error) {
            console.log(error);
        }
    }
    async sendStripePublishableKey(req: Request, res: Response) {
        res.status(200).json({
            publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
        })

    }
    async newPayment(req: Request, res: Response) {
        try {
            const myPayment = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'USD',
                description: 'payment for elearning app',
                metadata: {
                    company: "Elearning"
                },
                automatic_payment_methods: {
                    enabled: true,
                }
            })
            console.log(myPayment)
            res.status(201).json({
                success: true, client_secret: myPayment.client_secret
            })

        } catch (error) {
            console.log(error)

        }


    }
    async orderPayment(req: Request, res: Response) {
        try {

            const { id, courseId, payment_Info } = req.body
            if (payment_Info) {
                if ("id" in payment_Info) {
                    const paymentIntentId = payment_Info.id
                    const paymentIntent = await stripe.paymentIntents.retrieve(
                        paymentIntentId
                    )
                    if (paymentIntent.status !== "succeeded") {
                        return res.json({ message: "payment not authorised" })
                    }
                }
            }
            const orderPost = await this.userCase.addOrders(id, courseId, payment_Info)
            if (orderPost) {
                res.status(200).json({ success: true, orderPost });
            } else {
                res.status(200).json({ success: false });

            }
        }


        catch (error) {
            console.log(error)
        }
    }
    async CompletedLessonsView(req: Request, res: Response) {
        try {
            const id = req.params.id
            const userId = req.params.userId
            const lessencompletedview = await this.userCase.ViewCompletedLessons(id, userId)
            res.json(lessencompletedview)
        }
        catch (error) {
            console.log(error)
        }
    }
    async CompletedChapterView(req: Request, res: Response) {
        try {
            const id = req.params.id
            const userId = req.params.userId
            const Chaptercompletedview = await this.userCase.ViewCompletedChapter(id, userId)
            res.json(Chaptercompletedview)
        }
        catch (error) {
            console.log(error)
        }
    }
    async LessonCompletion(req: Request, res: Response) {
        try {
            const { id, lessonId, userId } = req.body
            console.log(id, lessonId)
            const lessencompleted = await this.userCase.CompleteLessons(id, lessonId, userId)
            res.json(lessencompleted)
        }
        catch (error) {
            console.log(error)
        }
    }

    async ChapterCompletion(req: Request, res: Response) {
        try {
            const { id, chapterId, userId } = req.body
            const lessencompleted = await this.userCase.CompleteChapters(id, chapterId, userId)
            res.json(lessencompleted)
        }
        catch (error) {
            console.log(error)
        }
    }
    async EnrolledCourseForStudent(req: Request, res: Response) {
        try {
            const id = req.params.id
            const EnrolledCourses = await this.userCase.getEnrolledCourseList(id)
            if (EnrolledCourses) {
                return res.status(200).json({ success: true, EnrolledCourses })
            } else {
                return res.status(401).json({ success: false, message: 'enrolled students  not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
    async Userview(req: Request, res: Response) {
        try {
            const id = req.params.id
            const user = await this.userCase.finduser(id)
            if (user) {
                return res.status(200).json({ success: true, user })
            } else {
                return res.status(401).json({ success: false, message: 'students not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }

    }

    async logout(req: Request, res: Response) {
        try {
            res.cookie("userToken", "", {
                httpOnly: true,
                expires: new Date(0)
            });
            res.cookie("courseId", "", {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ success: true, messge: 'successfully logout' })
        } catch (err) {
            console.log(err);

        }
    }




}
export default userController
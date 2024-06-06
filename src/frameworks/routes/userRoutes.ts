import express from "express"
import userController from "../../controller/userController"
import UserUseCase from "../../useCase/UserUseCase"
import JwtToken from "../services/JwtToken"
import HashPassword from "../services/HashPassword"
import GenerateOtp from "../services/GenerateOtp"
import sendMail from "../services/SendMail"
import Cloudinary from "../services/Cloudinary"
import userAuth from "../middleware/userAuth"

import userRepository from "../repository/userRepository"
import { uploadFile } from "../middleware/multer"
import courseRepository from "../repository/courseRepository"
import courseUseCase from "../../useCase/CourseUseCase"
import courseController from "../../controller/courseController"
import CourseAccessAuth from "../middleware/CourseAccessAuth"
import chatRepository from "../repository/chatRepository"
import chatUseCase from "../../useCase/chatUseCase"
import chatController from "../../controller/chatController"
const router =express.Router()
const jwt=new JwtToken()
const hash=new HashPassword()
const generateotp=new GenerateOtp()
const sendmail=new sendMail()
const cloud=new Cloudinary()
const courseRepo = new courseRepository();
const courseuseCase = new courseUseCase(courseRepo, cloud);
const CourseController = new courseController(courseuseCase);
const repository = new userRepository()
const userCase = new UserUseCase(repository, jwt, hash,generateotp,sendmail,cloud)
const controller = new userController(userCase)
const chatRepo = new chatRepository()
const chatusecase = new chatUseCase(chatRepo)
const ChatController = new chatController(chatusecase)

router.post('/signup',(req,res)=>controller.SignUpUser(req,res))
router.post('/verifyotp', (req, res) => controller.verifyOtp(req,res))
router.post('/resendotp', (req, res) => controller.resendOtp(req,res))
router.post('/userlogin', (req, res) => controller.userLogin(req,res))
router.post('/forgotpassword', (req, res) => controller.forgotpassword(req,res))
router.post('/verifyforgotpassword', (req, res) => controller.verifyForgotOtp(req,res))
router.post('/changedpassword', (req, res) => controller.changedPasword(req,res))
router.post('/google', (req, res) => controller.googleSignin(req,res))
router.get('/profile/:userId',userAuth,(req, res) => controller.profilePage(req,res))
router.get('/profileedit/:userId', userAuth,  (req, res) => controller.editProfile(req,res))
router.put('/updateprofile/:userId', userAuth,    (req, res) => controller.updateProfile(req,res))
router.put('/updatepassword/:userId', userAuth,  (req, res) => controller.changePassword(req,res))
router.put('/uploadprofilepic/:id', userAuth, uploadFile.single('image'),(req, res) => controller.uploadProfilepic(req,res))
router.put('/emailchange/:id', userAuth,  (req, res) => controller.changEmail(req,res))
router.post('/verifyEmail', userAuth, (req, res) => controller.ChangeEmailVerification(req,res))
router.get('/getcourse/:id',(req, res) => controller.getUserCousrse(req,res))
router.get('/courseAccess/:id', CourseAccessAuth, (req, res) => controller.getUserCourseAccess(req, res))
// router.post('/checkoutpage', userAuth, (req, res) => controller.checkoutSession(req,res))
router.get('/getpayment', userAuth, (req, res) => controller.sendStripePublishableKey(req,res))
router.get('/getvideocallkey', CourseAccessAuth, (req, res) => controller.SendVideoCallKey(req, res))
router.post('/payment', userAuth, (req, res) => controller.newPayment(req, res))
router.post('/orderpost', userAuth, (req, res) => controller.orderPayment(req, res))
router.get('/completedlessonview/:id/:userId', userAuth, (req, res) => controller.CompletedLessonsView(req, res))
router.get('/completedChapterview/:id/:userId', userAuth, (req, res) => controller.CompletedChapterView(req, res))
router.get('/enrolledview/:id', userAuth, (req, res) => controller.EnrolledCourseForStudent(req, res))
router.post('/completedlesson', userAuth, (req, res) => controller.LessonCompletion(req, res))
router.post('/completedchapter', userAuth,(req, res) => controller.ChapterCompletion(req, res))
router.get('/userbyid/:id',userAuth, (req, res) => controller.Userview(req, res))
router.post('/logout',(req, res) => controller.logout(req, res))
//course

router.get('/category',  (req, res) => CourseController.Categoryshow(req, res))
router.get('/course', (req, res) => CourseController.Courseshow(req, res))
router.get('/getcourse/:courseId', CourseAccessAuth, (req, res) => CourseController.EditDisplayCoursebyId(req, res))
router.get('/getchapters/:courseId', CourseAccessAuth, (req, res) => CourseController.DisplayChapters(req, res))
router.get('/search', (req, res) => CourseController.CourseSearch(req, res))
router.get('/chapter', (req, res) => CourseController.getChapter(req, res))
router.post('/reviewsubmit', (req, res) => CourseController.AddReviews(req, res))
router.post('/editreview', (req, res) => CourseController.EditReviews(req, res))
router.get('/fetchreviews/:id', (req, res) => CourseController.getReviews(req, res))
router.post("/answer", (req, res) => CourseController.QuestionAnswer(req, res));
router.get('/enrolled/:id/:usersId', (req, res) =>CourseController.GetEnrolled(req, res))

//chat

router.get('/getMessages/:conversationId', (req, res) => { ChatController.getMessages(req, res) });
router.post('/newConversation', (req, res) => { ChatController.newConversation(req, res) });
router.post('/newMessage', (req, res) => { ChatController.addMessage(req, res) });
router.get('/getConversation/:userId/:tutorid', (req, res) => { ChatController.getConversation(req, res) });
router.get('/findTutorById/:userId', (req, res) => { ChatController.findTutorById(req, res) });
router.get('/tutorschat', (req, res) => { ChatController.TrainersForChat(req, res) });


// router.post('/accesschat', (req, res) => { ChatController.accessChat(req, res) });
// router.get('/accesschat', (req, res) => { ChatController.fetchChats(req, res) });
// router.post('/group', (req, res) => { ChatController.createGroupchat(req, res) });
// router.put('/rename', (req, res) => { ChatController.renameGroup(req, res) });
// router.put('/groupremove', (req, res) => { ChatController.removeFromGroup(req, res) });
// router.put('/groupadd', (req, res) => { ChatController.addToGroup(req, res) });











export default router
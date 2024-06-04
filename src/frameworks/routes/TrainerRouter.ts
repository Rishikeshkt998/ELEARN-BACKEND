import trainerRepository from "../repository/trainerRepository"
import TrainerUseCase from "../../useCase/TrainerUseCase"
import trainerController from "../../controller/trainerController"
import JwtToken from "../services/JwtToken"
import Cloudinary from "../services/Cloudinary"
import express from "express"
import HashPassword from "../services/hashPassword"
import { uploadFile } from "../middleware/multer"
import GenerateOtp from "../services/GenerateOtp"
import sendMail from "../services/SendMail"
import courseRepository from "../repository/courseRepository"
import courseUseCase from "../../useCase/CourseUseCase"
import courseController from "../../controller/courseController"
import TrainerAuth from "../middleware/TrainerAuth"
import chatRepository from "../repository/chatRepository"
import chatUseCase from "../../useCase/chatUseCase"
import chatController from "../../controller/chatController"
const router = express.Router()

const jwt = new JwtToken()
const hashed = new HashPassword()
const cloud=new Cloudinary()
const generateotp = new GenerateOtp()
const sendmail = new sendMail()
const repository = new trainerRepository()
const trainerCase = new TrainerUseCase(repository, jwt, hashed, cloud, generateotp, sendmail)
const controller = new trainerController(trainerCase)
const courseRepo = new courseRepository();
const courseuseCase = new courseUseCase(courseRepo, cloud);
const CourseController = new courseController(courseuseCase);
const chatRepo = new chatRepository()
const chatusecase = new chatUseCase(chatRepo)
const ChatController = new chatController(chatusecase)
router.post('/trainersignup', (req, res) => controller.SignUpTrainer(req,res))
router.post('/trainerverifyotp', (req, res) => controller.verifyOtp(req, res))
router.post('/resendotptrainer', (req, res) => controller.resendOtpTrainer(req, res))
router.post('/trainerlogin', (req, res) => controller.TrainerLogin(req,res))
router.post('/trainerforgotpassword', (req, res) => controller.forgotpasswordTutor(req, res))
router.post('/verifyforgotpasswordtutor', (req, res) => controller.verifyForgotTutorOtp(req, res))
router.post('/changedpasswordtutor', (req, res) => controller.changedPaswordTutor(req, res))
router.get('/trainerprofile/:trainerId',TrainerAuth, (req, res) => controller.TrainerprofilePage(req,res))
router.get('/trainerprofileedit/:trainerId',  (req, res) => controller.editProfile(req,res))
router.put('/trainerupdateprofile/:trainerId',  (req, res) => controller.updatetutorProfile(req,res))
router.put('/trainerupdatepassword/:trainerId',  (req, res) => controller.changePassword(req,res))
router.put('/traineruploadprofilepic/:id',  uploadFile.single('image'), (req, res) => controller.uploadProfilepic(req,res))
router.get('/enrolledstudents', (req, res) => controller.EnrolledList(req, res))
router.post('/shedulelive', (req, res) => controller.SheduleCourse(req, res))
router.get('/coursetutor', (req, res) => controller.CourseshowTutor(req, res))
router.post('/trainerlogout', (req, res) => controller.trainerLogout(req, res))



//course
router.get('/course', (req, res) => CourseController.Courseshow(req, res))
router.get('/coursetutor',  (req, res) => CourseController.Courseshows(req, res))
router.get('/category', (req, res) => CourseController.Categoryshow(req,res))
router.post('/addcourse', (req, res) => CourseController.addCourse(req, res))
router.get('/getcourse/:courseId', (req, res) => CourseController.EditDisplayCoursebyId(req, res))
router.get('/getchapters/:courseId', (req, res) => CourseController.DisplayChapters(req, res))
router.post('/editcourse/:courseId', (req, res) => CourseController.EditCourse(req, res))
router.post('/publish/:id', (req, res) => CourseController.publishCourse(req, res))
router.post('/addchapter', (req, res) => CourseController.addChapter(req, res))
router.post('/deletecourse/:id', (req, res) => CourseController.DeleteCourses(req, res))
router.post('/question', (req, res) => CourseController.QuestionAdd(req, res))
router.get('/getquestion/:id', (req, res) => CourseController.GetQuestion(req, res))
router.get('/fetchreviews/:id', (req, res) => CourseController.getReviews(req, res))
router.post('/commentreply', (req, res) => CourseController.addReply(req, res))
router.get('/coursetutoranalysis/:id', (req, res) => CourseController.courseAnalysisForTutor(req, res))
router.get('/userdataanalysis/:id', (req, res) => CourseController.userAnalysisForTutor(req, res))
router.get('/orderdataanalysis/:id', (req, res) => CourseController.orderAnalysisForTutor(req, res))
router.get('/enrolled/:id/:usersId', (req, res) => CourseController.GetEnrolled(req, res))
router.post('/addchapter', (req, res) => CourseController.addChapter(req, res))
router.get('/chapter', (req, res) => CourseController.getChapter(req, res))


//chat


router.get('/getMessages/:conversationId', (req, res) => { ChatController.getMessages(req, res) });
router.post('/newConversation', (req, res) => { ChatController.newConversation(req, res) });
router.post('/newMessage', (req, res) => { ChatController.addMessage(req, res) });
router.get('/getConversation/:userId/:tutorid', (req, res) => { ChatController.getConversation(req, res) });
router.get('/findUserById/:userId', (req, res) => { ChatController.findUserById(req, res) });
router.get('/usersforchat', (req, res) => { ChatController.userForChat(req, res) });





    


export default router
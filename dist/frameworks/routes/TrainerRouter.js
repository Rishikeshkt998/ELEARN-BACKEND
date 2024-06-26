"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trainerRepository_1 = __importDefault(require("../repository/trainerRepository"));
const TrainerUseCase_1 = __importDefault(require("../../useCase/TrainerUseCase"));
const trainerController_1 = __importDefault(require("../../controller/trainerController"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const Cloudinary_1 = __importDefault(require("../services/Cloudinary"));
const express_1 = __importDefault(require("express"));
const hashPassword_1 = __importDefault(require("../services/hashPassword"));
const GenerateOtp_1 = __importDefault(require("../services/GenerateOtp"));
const SendMail_1 = __importDefault(require("../services/SendMail"));
const courseRepository_1 = __importDefault(require("../repository/courseRepository"));
const CourseUseCase_1 = __importDefault(require("../../useCase/CourseUseCase"));
const courseController_1 = __importDefault(require("../../controller/courseController"));
const TrainerAuth_1 = __importDefault(require("../middleware/TrainerAuth"));
const chatRepository_1 = __importDefault(require("../repository/chatRepository"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const chatController_1 = __importDefault(require("../../controller/chatController"));
const router = express_1.default.Router();
const jwt = new JwtToken_1.default();
const hashed = new hashPassword_1.default();
const cloud = new Cloudinary_1.default();
const generateotp = new GenerateOtp_1.default();
const sendmail = new SendMail_1.default();
const repository = new trainerRepository_1.default();
const trainerCase = new TrainerUseCase_1.default(repository, jwt, hashed, cloud, generateotp, sendmail);
const controller = new trainerController_1.default(trainerCase);
const courseRepo = new courseRepository_1.default();
const courseuseCase = new CourseUseCase_1.default(courseRepo, cloud);
const CourseController = new courseController_1.default(courseuseCase);
const chatRepo = new chatRepository_1.default();
const chatusecase = new chatUseCase_1.default(chatRepo);
const ChatController = new chatController_1.default(chatusecase);
router.post('/trainersignup', (req, res) => controller.SignUpTrainer(req, res));
router.post('/trainerverifyotp', (req, res) => controller.verifyOtp(req, res));
router.post('/resendotptrainer', (req, res) => controller.resendOtpTrainer(req, res));
router.post('/trainerlogin', (req, res) => controller.TrainerLogin(req, res));
router.post('/trainerforgotpassword', (req, res) => controller.forgotpasswordTutor(req, res));
router.post('/verifyforgotpasswordtutor', (req, res) => controller.verifyForgotTutorOtp(req, res));
router.post('/changedpasswordtutor', (req, res) => controller.changedPaswordTutor(req, res));
router.get('/trainerprofile/:trainerId', TrainerAuth_1.default, (req, res) => controller.TrainerprofilePage(req, res));
router.get('/trainerprofileedit/:trainerId', TrainerAuth_1.default, (req, res) => controller.editProfile(req, res));
router.put('/trainerupdateprofile/:trainerId', TrainerAuth_1.default, (req, res) => controller.updatetutorProfile(req, res));
router.put('/trainerupdatepassword/:trainerId', TrainerAuth_1.default, (req, res) => controller.changePassword(req, res));
router.post('/traineruploadprofilepic', TrainerAuth_1.default, (req, res) => controller.uploadProfilepic(req, res));
router.get('/enrolledstudents', TrainerAuth_1.default, (req, res) => controller.EnrolledList(req, res));
router.post('/shedulelive', TrainerAuth_1.default, (req, res) => controller.SheduleCourse(req, res));
router.get('/coursetutor', TrainerAuth_1.default, (req, res) => controller.CourseshowTutor(req, res));
router.post('/trainerlogout', TrainerAuth_1.default, (req, res) => controller.trainerLogout(req, res));
//course
router.get('/course', TrainerAuth_1.default, (req, res) => CourseController.Courseshow(req, res));
router.get('/coursetutor/:id', TrainerAuth_1.default, (req, res) => CourseController.Courseshows(req, res));
router.get('/category', TrainerAuth_1.default, (req, res) => CourseController.Categoryshow(req, res));
router.post('/addcourse', (req, res) => CourseController.addCourse(req, res));
router.get('/getcourse/:courseId', TrainerAuth_1.default, (req, res) => CourseController.EditDisplayCoursebyId(req, res));
router.get('/getchapters/:courseId', TrainerAuth_1.default, (req, res) => CourseController.DisplayChapters(req, res));
router.post('/editcourse/:courseId', (req, res) => CourseController.EditCourse(req, res));
router.post('/publish/:id', TrainerAuth_1.default, (req, res) => CourseController.publishCourse(req, res));
router.post('/addchapter', TrainerAuth_1.default, (req, res) => CourseController.addChapter(req, res));
router.post('/deletecourse/:id', TrainerAuth_1.default, (req, res) => CourseController.DeleteCourses(req, res));
router.post('/question', TrainerAuth_1.default, (req, res) => CourseController.QuestionAdd(req, res));
router.delete('/removequestion', TrainerAuth_1.default, (req, res) => CourseController.removeQuestion(req, res));
router.get('/getquestion/:id', TrainerAuth_1.default, (req, res) => CourseController.GetQuestion(req, res));
router.get('/fetchreviews/:id', TrainerAuth_1.default, (req, res) => CourseController.getReviews(req, res));
router.post('/commentreply', TrainerAuth_1.default, (req, res) => CourseController.addReply(req, res));
router.get('/totalcountTutor/:id', TrainerAuth_1.default, (req, res) => CourseController.TotalTutorCount(req, res));
router.get('/coursetutoranalysis/:id', TrainerAuth_1.default, (req, res) => CourseController.courseAnalysisForTutor(req, res));
router.get('/userdataanalysis/:id', TrainerAuth_1.default, (req, res) => CourseController.userAnalysisForTutor(req, res));
router.get('/orderdataanalysis/:id', TrainerAuth_1.default, (req, res) => CourseController.orderAnalysisForTutor(req, res));
router.get('/enrolled/:id/:usersId', TrainerAuth_1.default, (req, res) => CourseController.GetEnrolled(req, res));
router.post('/addchapter', TrainerAuth_1.default, (req, res) => CourseController.addChapter(req, res));
router.get('/chapter', TrainerAuth_1.default, (req, res) => CourseController.getChapter(req, res));
//chat
router.get('/getMessages/:conversationId', (req, res) => { ChatController.getMessages(req, res); });
router.post('/newConversation', (req, res) => { ChatController.newConversation(req, res); });
router.post('/newMessage', (req, res) => { ChatController.addMessage(req, res); });
router.put('/readMessage/:id', (req, res) => { ChatController.MakeasRead(req, res); });
router.get('/getConversation/:userId/:tutorid', (req, res) => { ChatController.getConversation(req, res); });
router.get('/findUserById/:userId', (req, res) => { ChatController.findUserById(req, res); });
router.get('/usersforchat/:userId', (req, res) => { ChatController.userForChat(req, res); });
exports.default = router;

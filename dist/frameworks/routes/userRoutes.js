"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../../controller/userController"));
const UserUseCase_1 = __importDefault(require("../../useCase/UserUseCase"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const hashPassword_1 = __importDefault(require("../services/hashPassword"));
const GenerateOtp_1 = __importDefault(require("../services/GenerateOtp"));
const SendMail_1 = __importDefault(require("../services/SendMail"));
const Cloudinary_1 = __importDefault(require("../services/Cloudinary"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const courseRepository_1 = __importDefault(require("../repository/courseRepository"));
const CourseUseCase_1 = __importDefault(require("../../useCase/CourseUseCase"));
const courseController_1 = __importDefault(require("../../controller/courseController"));
const CourseAccessAuth_1 = __importDefault(require("../middleware/CourseAccessAuth"));
const chatRepository_1 = __importDefault(require("../repository/chatRepository"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const chatController_1 = __importDefault(require("../../controller/chatController"));
const router = express_1.default.Router();
const jwt = new JwtToken_1.default();
const hash = new hashPassword_1.default();
const generateotp = new GenerateOtp_1.default();
const sendmail = new SendMail_1.default();
const cloud = new Cloudinary_1.default();
const courseRepo = new courseRepository_1.default();
const courseuseCase = new CourseUseCase_1.default(courseRepo, cloud);
const CourseController = new courseController_1.default(courseuseCase);
const repository = new userRepository_1.default();
const userCase = new UserUseCase_1.default(repository, jwt, hash, generateotp, sendmail, cloud);
const controller = new userController_1.default(userCase);
const chatRepo = new chatRepository_1.default();
const chatusecase = new chatUseCase_1.default(chatRepo);
const ChatController = new chatController_1.default(chatusecase);
router.post('/signup', (req, res) => controller.SignUpUser(req, res));
router.post('/verifyotp', (req, res) => controller.verifyOtp(req, res));
router.post('/resendotp', (req, res) => controller.resendOtp(req, res));
router.post('/userlogin', (req, res) => controller.userLogin(req, res));
router.post('/forgotpassword', (req, res) => controller.forgotpassword(req, res));
router.post('/verifyforgotpassword', (req, res) => controller.verifyForgotOtp(req, res));
router.post('/changedpassword', (req, res) => controller.changedPasword(req, res));
router.post('/google', (req, res) => controller.googleSignin(req, res));
router.get('/profile/:userId', userAuth_1.default, (req, res) => controller.profilePage(req, res));
router.get('/profileedit/:userId', userAuth_1.default, (req, res) => controller.editProfile(req, res));
router.put('/updateprofile/:userId', userAuth_1.default, (req, res) => controller.updateProfile(req, res));
router.put('/updatepassword/:userId', userAuth_1.default, (req, res) => controller.changePassword(req, res));
router.post('/uploadprofilepic', userAuth_1.default, (req, res) => controller.uploadProfilepic(req, res));
router.put('/emailchange/:id', userAuth_1.default, (req, res) => controller.changEmail(req, res));
router.post('/verifyEmail', userAuth_1.default, (req, res) => controller.ChangeEmailVerification(req, res));
router.get('/getcoursevalue/:id', (req, res) => controller.getUserCousrse(req, res));
router.get('/courseAccess/:id', CourseAccessAuth_1.default, (req, res) => controller.getUserCourseAccess(req, res));
router.get('/getpayment', userAuth_1.default, (req, res) => controller.sendStripePublishableKey(req, res));
router.get('/getvideocallkey', CourseAccessAuth_1.default, (req, res) => controller.SendVideoCallKey(req, res));
router.post('/payment', userAuth_1.default, (req, res) => controller.newPayment(req, res));
router.post('/orderpost', userAuth_1.default, (req, res) => controller.orderPayment(req, res));
router.get('/completedlessonview/:id/:userId', CourseAccessAuth_1.default, (req, res) => controller.CompletedLessonsView(req, res));
router.get('/completedChapterview/:id/:userId', CourseAccessAuth_1.default, (req, res) => controller.CompletedChapterView(req, res));
router.get('/enrolledview/:id', userAuth_1.default, (req, res) => controller.EnrolledCourseForStudent(req, res));
router.post('/completedlesson', userAuth_1.default, (req, res) => controller.LessonCompletion(req, res));
router.post('/completedchapter', userAuth_1.default, (req, res) => controller.ChapterCompletion(req, res));
router.post('/completiontime', (req, res) => controller.CompletionTimeUpdate(req, res));
router.get('/userbyid/:id', userAuth_1.default, (req, res) => controller.Userview(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
//course
router.get('/category', (req, res) => CourseController.Categoryshow(req, res));
router.get('/course', (req, res) => CourseController.Courseshow(req, res));
router.get('/getcourse/:courseId', CourseAccessAuth_1.default, (req, res) => CourseController.EditDisplayCoursebyId(req, res));
router.get('/getchapters/:courseId', (req, res) => CourseController.DisplayChapters(req, res));
router.get('/search', (req, res) => CourseController.CourseSearch(req, res));
router.get('/chapter', (req, res) => CourseController.getChapter(req, res));
router.post('/reviewsubmit', (req, res) => CourseController.AddReviews(req, res));
router.post('/editreview', (req, res) => CourseController.EditReviews(req, res));
router.get('/fetchreviews/:id', (req, res) => CourseController.getReviews(req, res));
router.post("/answer", (req, res) => CourseController.QuestionAnswer(req, res));
router.get('/enrolled/:id/:usersId', (req, res) => CourseController.GetEnrolled(req, res));
router.get('/downloadcertificate/:courseId/:studentId', (req, res) => CourseController.generateCertificate(req, res));
//chat
router.get('/getMessages/:conversationId', (req, res) => { ChatController.getMessages(req, res); });
router.post('/newConversation', (req, res) => { ChatController.newConversation(req, res); });
router.post('/newMessage', (req, res) => { ChatController.addMessage(req, res); });
router.get('/getConversation/:userId/:tutorid', (req, res) => { ChatController.getConversation(req, res); });
router.get('/findTutorById/:userId', (req, res) => { ChatController.findTutorById(req, res); });
router.get('/tutorschat/:userId', (req, res) => { ChatController.TrainersForChat(req, res); });
router.get('/enrolledforpurchase/:usersId', (req, res) => CourseController.GetEnrolledForPurchase(req, res));
router.get('/enrolledforpurchase/:usersId', (req, res) => CourseController.GetEnrolledForPurchase(req, res));
router.post('/addtofavourite', (req, res) => CourseController.addToFavourite(req, res));
router.get('/getfavourites', (req, res) => CourseController.fetchFavourites(req, res));
exports.default = router;

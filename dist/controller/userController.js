"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JwtToken_1 = __importDefault(require("../frameworks/services/JwtToken"));
const HTTPstatus_1 = require("../frameworks/services/HTTPstatus");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = new JwtToken_1.default();
class userController {
    constructor(userCase) {
        this.userCase = userCase;
    }
    SignUpUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield this.userCase.signupUser(userData);
                if (user) {
                    res.status(HTTPstatus_1.HTTP_STATUS_OK).json({ success: true, user });
                }
                else {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log('signup error : ', error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userOtp = req.body;
                const saveUser = yield this.userCase.VerifyUser(userOtp.otp, userOtp.id);
                if (saveUser === null || saveUser === void 0 ? void 0 : saveUser.success) {
                    return res.status(200).json({ success: true, message: saveUser });
                }
                else if (!(saveUser === null || saveUser === void 0 ? void 0 : saveUser.success)) {
                    return res.status(200).json({ success: false, message: saveUser === null || saveUser === void 0 ? void 0 : saveUser.message });
                }
                res.json(saveUser);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userCase.LoginUser(email, password);
                if (user === null || user === void 0 ? void 0 : user.success) {
                    res.cookie('refreshToken', user.Refreshtoken, {
                        sameSite: "none",
                        secure: true
                    }).status(200).json(user);
                }
                else if (!(user === null || user === void 0 ? void 0 : user.success)) {
                    return res.status(200).json({ success: false, message: user === null || user === void 0 ? void 0 : user.message });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error!" });
            }
        });
    }
    forgotpassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const forgot = yield this.userCase.forgotPassword(email);
                res.json(forgot);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyForgotOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const verifyforgott = yield this.userCase.VerifyforgotUser(email, otp);
                if (verifyforgott) {
                    res.status(HTTPstatus_1.HTTP_STATUS_OK).json({ success: true, verifyforgott });
                }
                else {
                    res.status(HTTPstatus_1.HTTP_STATUS_OK).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changedPasword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newpassword, confirmpassword } = req.body;
                const updatepassword = yield this.userCase.changePass(email, newpassword, confirmpassword);
                res.json(updatepassword);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    googleSignin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name } = req.body;
                const googleSigned = yield this.userCase.googleSignin(email, name);
                console.log("goo", googleSigned);
                if (googleSigned === null || googleSigned === void 0 ? void 0 : googleSigned.success) {
                    res.cookie('refreshToken', googleSigned.Refreshtoken, {
                        sameSite: "none",
                        secure: true
                    }).status(200).json(googleSigned);
                    return res.status(200).json(googleSigned);
                }
                else if (!(googleSigned === null || googleSigned === void 0 ? void 0 : googleSigned.success)) {
                    return res.status(200).json({ success: false, message: googleSigned === null || googleSigned === void 0 ? void 0 : googleSigned.message });
                }
                res.json(googleSigned);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    profilePage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (userId) {
                    const profile = yield this.userCase.userProfile(userId);
                    if (profile) {
                        return res.status(200).json({ success: true, profile });
                    }
                    else {
                        return res.status(401).json({ success: true, message: 'authentication error' });
                    }
                }
                else {
                    return res.status(401).json({ success: true, message: 'userid not found' });
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                if (userId) {
                    const profile = yield this.userCase.profileedit(userId);
                    if (profile) {
                        return res.status(200).json({ success: true, profile });
                    }
                    else {
                        return res.status(200).json({ success: false, message: 'user not found' });
                    }
                }
                else {
                    return res.status(401).json({ success: true, message: 'userid not found' });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.userId;
                let userData = req.body;
                const updatedprofile = yield this.userCase.updateProfile(id, userData);
                return res.status(HTTPstatus_1.HTTP_STATUS_OK).json({ success: true, updatedprofile });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const isRsendOTP = yield this.userCase.resendOtp(email);
                if (isRsendOTP) {
                    res.json({ success: true, message: 'Resend OTP successful' });
                }
                else {
                    res.json({ sucess: false, message: 'Resend OTP failed..!' });
                }
            }
            catch (error) {
                console.log('resend otp error in userController', error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldpassword, newpassword, confirmpassword } = req.body;
                const id = req.params.userId;
                const changed = yield this.userCase.ChangePassword(id, oldpassword, newpassword, confirmpassword);
                return res.status(200).json({ success: true, changed });
            }
            catch (error) {
                console.error('Error changing password:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    uploadProfilepic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, imageUrl } = req.body;
                const Response = yield this.userCase.profilePicUpdate(userId, imageUrl);
                return res.json(Response);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    changEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { email } = data;
                const id = req.params.id;
                const emailchange = yield this.userCase.EmailChange(id, email);
                res.json(emailchange);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ChangeEmailVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const changedEmail = yield this.userCase.VerificationEmail(email, otp);
                if (changedEmail) {
                    res.status(200).json({ success: true, changedEmail });
                }
                else {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUserCousrse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const courseIdCookie = req.cookies.courseId;
                if (!courseIdCookie) {
                    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
                    res.cookie('courseId', id, {
                        maxAge: oneDayInMilliseconds,
                        sameSite: "none",
                        secure: true
                    });
                }
                const Response = yield this.userCase.getUserCourse(id);
                if (Response) {
                    res.status(200).json({ success: true, message: 'get the userdata', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in getting the course data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getUserCourseAccess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const Response = yield this.userCase.getUserCourseAccess(id);
                if (Response) {
                    res.status(200).json({ success: true, message: 'get the userdata', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in getting the course data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    SendVideoCallKey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                appID: process.env.APPID,
                serverSecret: process.env.SERVERSECRET
            });
        });
    }
    sendStripePublishableKey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                publishablekey: process.env.STRIPE_PUBLISHABLE_KEY
            });
        });
    }
    newPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const myPayment = yield stripe.paymentIntents.create({
                    amount: req.body.amount,
                    currency: 'USD',
                    description: 'payment for elearning app',
                    metadata: {
                        company: "Elearning"
                    },
                    automatic_payment_methods: {
                        enabled: true,
                    }
                });
                console.log(myPayment);
                res.status(201).json({
                    success: true, client_secret: myPayment.client_secret
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    orderPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, courseId, payment_Info } = req.body;
                if (payment_Info) {
                    if ("id" in payment_Info) {
                        const paymentIntentId = payment_Info.id;
                        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                        if (paymentIntent.status !== "succeeded") {
                            return res.json({ message: "payment not authorised" });
                        }
                    }
                }
                const orderPost = yield this.userCase.addOrders(id, courseId, payment_Info);
                if (orderPost) {
                    res.status(200).json({ success: true, orderPost });
                }
                else {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    CompletedLessonsView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const userId = req.params.userId;
                const lessencompletedview = yield this.userCase.ViewCompletedLessons(id, userId);
                res.json(lessencompletedview);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    CompletedChapterView(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const userId = req.params.userId;
                const Chaptercompletedview = yield this.userCase.ViewCompletedChapter(id, userId);
                res.json(Chaptercompletedview);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    LessonCompletion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, lessonId, userId } = req.body;
                console.log(id, lessonId);
                const lessencompleted = yield this.userCase.CompleteLessons(id, lessonId, userId);
                res.json(lessencompleted);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ChapterCompletion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, chapterId, userId } = req.body;
                const lessencompleted = yield this.userCase.CompleteChapters(id, chapterId, userId);
                res.json(lessencompleted);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    EnrolledCourseForStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const EnrolledCourses = yield this.userCase.getEnrolledCourseList(id);
                if (EnrolledCourses) {
                    return res.status(200).json({ success: true, EnrolledCourses });
                }
                else {
                    return res.status(401).json({ success: false, message: 'enrolled students  not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(HTTPstatus_1.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        });
    }
    Userview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield this.userCase.finduser(id);
                if (user) {
                    return res.status(200).json({ success: true, user });
                }
                else {
                    return res.status(401).json({ success: false, message: 'students not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(HTTPstatus_1.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('refreshToken', "", {
                    sameSite: "none",
                    secure: true
                });
                res.cookie("courseId", "", {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true, messge: 'successfully logout' });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.default = userController;

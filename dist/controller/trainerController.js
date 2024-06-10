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
Object.defineProperty(exports, "__esModule", { value: true });
const HTTPstatus_1 = require("../frameworks/services/HTTPstatus");
class trainerController {
    constructor(trainerCase) {
        this.trainerCase = trainerCase;
    }
    SignUpTrainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let trainerData = req.body;
                const trainer = yield this.trainerCase.TrainerSignUp(trainerData);
                res.json(trainer);
            }
            catch (error) {
                console.log('signup error : ', error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorOtp = req.body;
                const saveTutor = yield this.trainerCase.VerifyTutor(tutorOtp.otp, tutorOtp.id);
                if (saveTutor === null || saveTutor === void 0 ? void 0 : saveTutor.success) {
                    return res.status(200).json(saveTutor);
                }
                else if (!(saveTutor === null || saveTutor === void 0 ? void 0 : saveTutor.success)) {
                    return res.status(HTTPstatus_1.HTTP_STATUS_OK).json({ success: false, message: saveTutor === null || saveTutor === void 0 ? void 0 : saveTutor.message });
                }
                // res.json(saveTutor)
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error!" });
            }
        });
    }
    resendOtpTrainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const isRsendOTP = yield this.trainerCase.resendOtpTrainer(email);
                if (isRsendOTP) {
                    res.json({ success: true, message: 'Resend OTP successful', isRsendOTP });
                }
                else {
                    res.json({ sucess: false, message: 'Resend OTP failed..!' });
                }
            }
            catch (error) {
                console.log('resend otp error in tutor controller', error);
            }
        });
    }
    TrainerLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const trainerData = yield this.trainerCase.LoginTrainer(email, password);
                if (trainerData === null || trainerData === void 0 ? void 0 : trainerData.success) {
                    res.cookie('trainerToken', trainerData.token, { maxAge: 900000, httpOnly: true });
                    return res.status(200).json(trainerData);
                }
                else if (!(trainerData === null || trainerData === void 0 ? void 0 : trainerData.success)) {
                    return res.status(200).json({ success: false, message: trainerData === null || trainerData === void 0 ? void 0 : trainerData.message });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error!" });
            }
        });
    }
    forgotpasswordTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const forgot = yield this.trainerCase.forgotPasswordTutor(email);
                return res.json(forgot);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error!" });
            }
        });
    }
    verifyForgotTutorOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const verifyforgott = yield this.trainerCase.VerifyforgotTutor(email, otp);
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
    changedPaswordTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newpassword, confirmpassword } = req.body;
                const updatepassword = yield this.trainerCase.changePasswordTutor(email, newpassword, confirmpassword);
                res.json(updatepassword);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TrainerprofilePage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                if (trainerId) {
                    const trainerprofile = yield this.trainerCase.trainerProfile(trainerId);
                    if (trainerprofile) {
                        return res.status(200).json({ success: true, trainerprofile });
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
                const trainerId = req.params.trainerId;
                if (trainerId) {
                    const profile = yield this.trainerCase.trainerprofileedit(trainerId);
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
                console.log(error);
            }
        });
    }
    updatetutorProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.params.trainerId;
                let trainerData = req.body;
                const updatedtrainerprofile = yield this.trainerCase.updateTrainerProfile(trainerId, trainerData);
                return res.status(200).json({ success: true, updatedtrainerprofile });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldpassword, newpassword, confirmpassword } = req.body;
                const id = req.params.trainerId;
                const changedtrainer = yield this.trainerCase.ChangeTrainerPassword(id, oldpassword, newpassword, confirmpassword);
                return res.status(200).json({ success: true, changedtrainer });
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
                // const imageFile: Express.Multer.File | undefined = req.file;
                // if (!imageFile) {
                //     return res.status(400).json({ success: false, message: 'No image uploaded' });
                // }
                // const imagePath = imageFile.path;
                // const id = req.params.id
                const { trainerId, imageUrl } = req.body;
                const Response = yield this.trainerCase.trainerProfilePicUpdate(trainerId, imageUrl);
                return res.json(Response);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    EnrolledList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EnrolledStudents = yield this.trainerCase.getEnrolledList();
                if (EnrolledStudents) {
                    return res.status(200).json({ success: true, EnrolledStudents });
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
    SheduleCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, meetingDate, meetingTime, meetingCode, description } = req.body;
                const sheduledcourse = yield this.trainerCase.MeetingShedule(id, meetingDate, meetingTime, meetingCode, description);
                if (sheduledcourse) {
                    return res.status(200).json({ success: true, sheduledcourse });
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
    CourseshowTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.trainerCase.showCourseTutor();
                if (course) {
                    return res.status(200).json(course);
                }
                else {
                    return res.status(401).json({ success: false, message: 'course not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    trainerLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("trainerToken", "", {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = trainerController;

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
class TrainerUseCase {
    constructor(ItrainerRepository, JwtToken, HashPassword, Cloudinary, GenerateOtp, sendMail) {
        this.ItrainerRepository = ItrainerRepository,
            this.JwtToken = JwtToken;
        this.HashPassword = HashPassword;
        this.Cloudinary = Cloudinary;
        this.GenerateOtp = GenerateOtp;
        this.sendMail = sendMail;
    }
    TrainerSignUp(trainer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = trainer.email;
                const isTrainer = yield this.ItrainerRepository.findTrainerByEmail(email);
                if (isTrainer) {
                    return { success: false, message: 'This Email is already exists' };
                }
                else {
                    const hashedPassword = yield this.HashPassword.Hashing(trainer.password);
                    trainer.password = hashedPassword;
                    const otp = yield this.GenerateOtp.generateOtp(4);
                    console.log(otp);
                    trainer.otp = otp;
                    this.sendMail.SendMail(trainer.name, trainer.email, otp);
                    const trainerSave = yield this.ItrainerRepository.saveTrainer(trainer);
                    if (!trainerSave) {
                        return { success: false, message: 'Something went wrong while saving trainer data' };
                    }
                    else {
                        return { success: true, message: 'trainer successfully registered,wait for admin to verify this account', trainerSave };
                    }
                }
            }
            catch (error) {
                console.log('trainer signup error in UserUseCase:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    VerifyTutor(otp, tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("tutorid", tutorId);
            const tutorData = yield this.ItrainerRepository.findTutorById(tutorId);
            if (otp === (tutorData === null || tutorData === void 0 ? void 0 : tutorData.otp)) {
                const updated = yield this.ItrainerRepository.verifyTutor(tutorId);
                return { success: true, message: 'email verification successfull,wait for admin to verify this account', updated };
            }
            else {
                return { success: false, message: 'invalid otp' };
            }
        });
    }
    resendOtpTrainer(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Realotp = yield this.GenerateOtp.generateOtp(4);
                const saveotp = yield this.ItrainerRepository.updateTrainerOtp(email, Realotp);
                this.sendMail.SendMail(email, email, Realotp);
                return Realotp;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    LoginTrainer(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerData = yield this.ItrainerRepository.findTrainerByEmail(email);
                if (trainerData) {
                    const matched = yield this.HashPassword.Compare(password, trainerData.password);
                    if (!matched) {
                        return { success: false, message: "Incorrect password" };
                    }
                    else if (!trainerData.isVerified) {
                        return { success: false, message: 'tutor is not verified by the admin' };
                    }
                    else {
                        const token = yield this.JwtToken.SignJwt(trainerData._id, "trainer");
                        // const token = await this.JwtToken.SignJwt(trainerData)
                        return { success: true, adminData: trainerData, token: token };
                    }
                }
                else {
                    return { success: false, message: 'email is not valid' };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerfind = yield this.ItrainerRepository.findTrainerByEmail(email);
                console.log(trainerfind);
                if (!trainerfind) {
                    return { success: false, message: 'Email not found' };
                }
                if ((trainerfind === null || trainerfind === void 0 ? void 0 : trainerfind.isVerified) === false) {
                    return { success: false, message: 'tutor is not verified by the admin' };
                }
                else {
                    const otp = yield this.GenerateOtp.generateOtp(4);
                    const sendmail = this.sendMail.SendMail(email, email, otp);
                    const update = yield this.ItrainerRepository.updateTutor(email, otp);
                    return { success: true, email, otp };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    VerifyforgotTutor(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("email", email, otp);
                const tutorData = yield this.ItrainerRepository.findByEmailTutor(email);
                if (!tutorData) {
                    return { success: false, message: "user not found" };
                }
                if (tutorData.otp === otp) {
                    return { success: true, message: "Password successfully verified with OTP" };
                }
                else {
                    return { success: false, message: "Invalid OTP" };
                }
            }
            catch (error) {
                console.error('Error verifying OTP:', error);
                return { success: false, message: "Error verifying OTP: " + error };
            }
        });
    }
    changePasswordTutor(email, newpassword, confirmpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (newpassword !== confirmpassword) {
                    return { success: false, message: 'New password and confirm password do not match' };
                }
                const tutorData = yield this.ItrainerRepository.findTrainerByEmail(email);
                if (!tutorData) {
                    return { success: false, message: 'User not found' };
                }
                const hashpassword = yield this.HashPassword.Hashing(newpassword);
                tutorData.password = hashpassword;
                const saveTutor = yield this.ItrainerRepository.savehashPasssword(email, hashpassword);
                return { success: true, message: "password changed successfully", saveTutor };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    trainerProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerData = yield this.ItrainerRepository.findTrainerProfile(id);
                return trainerData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    trainerprofileedit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerData = yield this.ItrainerRepository.TrainerProfileEdit(id);
                return trainerData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateTrainerProfile(id, trainer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let trainerExists = yield this.ItrainerRepository.findTrainerById(id);
                let response = yield this.ItrainerRepository.updateTrainerProfile(id, trainer);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ChangeTrainerPassword(id, oldpassword, newpassword, confirmpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (newpassword !== confirmpassword) {
                    return { success: false, message: 'New password and confirm password do not match' };
                }
                const trainerData = yield this.ItrainerRepository.findTrainerById(id);
                if (!trainerData) {
                    return { success: false, message: 'User not found' };
                }
                const isOldPasswordCorrect = yield this.HashPassword.Compare(oldpassword, trainerData.password);
                if (!isOldPasswordCorrect) {
                    return { success: false, message: 'Incorrect old password' };
                }
                const hashedNewPassword = yield this.HashPassword.Hashing(newpassword);
                const saveTrainer = yield this.ItrainerRepository.savehashPasswordbyId(id, hashedNewPassword);
                if (!saveTrainer) {
                    return { success: false, message: 'Failed to save new password' };
                }
                return { success: true, message: 'Password changed successfully' };
            }
            catch (error) {
                console.error('Error changing password:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    trainerProfilePicUpdate(id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const imageUrl = await this.Cloudinary.savetocloudinary(imagePath)
                // console.log(imageUrl)
                if (imageUrl) {
                    const saveimage = yield this.ItrainerRepository.Trainersaveimage(id, imageUrl);
                    return { success: true, message: "Image uploaded successfully", imageUrl, saveimage };
                }
                else {
                    return { success: false, message: "Failed to upload image" };
                }
            }
            catch (error) {
                console.error("Error during image upload:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    getEnrolledList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EnrolledStudents = yield this.ItrainerRepository.findEnrolledStudents();
                if (EnrolledStudents) {
                    return EnrolledStudents;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    MeetingShedule(id, meetingDate, meetingTime, meetingCode, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const shedulemeet = yield this.ItrainerRepository.Shedulemeeting(id, meetingDate, meetingTime, meetingCode, description);
                if (shedulemeet) {
                    return shedulemeet;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    showCourseTutor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.ItrainerRepository.findCoursesTutor();
                if (course) {
                    return course;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = TrainerUseCase;

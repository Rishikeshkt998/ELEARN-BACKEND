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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserUseCase {
    constructor(iuserRepository, JwtToken, HashPassword, GenerateOtp, sendMail, Cloudinary) {
        this.iuserRepository = iuserRepository;
        this.JwtToken = JwtToken;
        this.HashPassword = HashPassword;
        this.GenerateOtp = GenerateOtp;
        this.sendMail = sendMail;
        this.Cloudinary = Cloudinary;
    }
    signupUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = user.email;
                const isUser = yield this.iuserRepository.findByEmail(email);
                if (isUser) {
                    return { success: false, message: "Email already exists" };
                }
                const hashedPassword = yield this.HashPassword.Hashing(user.password);
                user.password = hashedPassword;
                const otp = yield this.GenerateOtp.generateOtp(4);
                user.otp = otp;
                this.sendMail.SendMail(user.name, user.email, otp);
                let token = jsonwebtoken_1.default.sign({ user, otp }, process.env.JWT_SECRET_KEY, { expiresIn: "5m" });
                console.log(token);
                const saveUser = yield this.iuserRepository.saveUser(user);
                if (saveUser) {
                    return { status: 200, message: "Signup successful", data: saveUser };
                }
                else {
                    return { status: 500, message: "Failed to save user data" };
                }
            }
            catch (error) {
                console.error("Error during user signup:", error);
                return { status: 500, message: "Internal server error" };
            }
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Realotp = yield this.GenerateOtp.generateOtp(4);
                const saveotp = yield this.iuserRepository.updateOtp(email, Realotp);
                this.sendMail.SendMail(email, email, Realotp);
                return Realotp;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    VerifyUser(otp, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this.iuserRepository.findById(userId);
            if (otp === (userData === null || userData === void 0 ? void 0 : userData.otp)) {
                const updated = yield this.iuserRepository.verifyUser(userId);
                return { success: true, message: 'Signup successful..!', updated };
            }
            else {
                return { success: false, message: 'email is not verified' };
            }
        });
    }
    LoginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.findByEmail(email);
                if (userData) {
                    const matched = yield this.HashPassword.Compare(password, userData.password);
                    if (!matched) {
                        return { success: false, message: "Incorrect password" };
                    }
                    else if (userData.isBlocked) {
                        return { success: false, message: "User is blocked by admin!" };
                    }
                    else {
                        const token = yield this.JwtToken.SignUserJwt(userData._id, "user");
                        const Refreshtoken = yield this.JwtToken.refreshToken(userData._id, "user");
                        return { success: true, userData: userData, token: token, Refreshtoken: Refreshtoken };
                    }
                }
                else {
                    return { success: false, message: 'email is wrong' };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield this.GenerateOtp.generateOtp(4);
                const sendmail = this.sendMail.SendMail(email, email, otp);
                const update = yield this.iuserRepository.updateUser(email, otp);
                return { success: true, email, otp };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    VerifyforgotUser(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.findByEmail(email);
                if (!userData) {
                    throw new Error('User not found');
                }
                if (userData.otp === otp) {
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
    changePass(email, newpassword, confirmpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (newpassword !== confirmpassword) {
                    return { success: false, message: 'New password and confirm password do not match' };
                }
                const userData = yield this.iuserRepository.findByEmail(email);
                if (!userData) {
                    return { success: false, message: 'User not found' };
                }
                const hashpassword = yield this.HashPassword.Hashing(newpassword);
                userData.password = hashpassword;
                const saveUser = yield this.iuserRepository.savehashPasssword(email, hashpassword);
                return { success: true, message: "password changed successfully" };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    googleSignin(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.findByEmail(email);
                if (userData) {
                    if (userData.isBlocked) {
                        return { success: false, message: "user has been blocked by the user" };
                    }
                    const token = yield this.JwtToken.SignJwt(userData._id, "user");
                    // const token = await this.JwtToken.SignJwt(userData);
                    const Refreshtoken = yield this.JwtToken.refreshToken(userData._id, "user");
                    // const Refreshtoken = await this.JwtToken.refreshToken(userData)
                    const { password } = userData, rest = __rest(userData, ["password"]);
                    return { success: true, userData: userData, token: token, Refreshtoken: Refreshtoken };
                }
                else {
                    const passwordgenerated = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                    const hashPassword = yield this.HashPassword.Hashing(passwordgenerated);
                    const phone = '9654321834';
                    const user = {
                        name: name,
                        email: email,
                        password: hashPassword,
                        phone: phone
                    };
                    const newuser = yield this.iuserRepository.saveUser(user);
                    const uservalue = yield this.iuserRepository.verifyGoogleUser(email);
                    yield this.iuserRepository.verifyUser(email);
                    const token = yield this.JwtToken.SignJwt(uservalue._id, "user");
                    // const token = await this.JwtToken.SignJwt(uservalue);
                    const Refreshtoken = yield this.JwtToken.refreshToken(uservalue._id, "user");
                    // const Refreshtoken = await this.JwtToken.refreshToken(uservalue)
                    return { success: true, userData: uservalue, token: token, Refreshtoken: Refreshtoken };
                }
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred during sign-in" };
            }
        });
    }
    userProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.findProfile(id);
                return userData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    profileedit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.ProfileEdit(id);
                return userData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateProfile(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExists = yield this.iuserRepository.findById(id);
                let response = yield this.iuserRepository.updateUserProfile(id, user);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ChangePassword(id, oldpassword, newpassword, confirmpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (newpassword !== confirmpassword) {
                    return { success: false, message: 'New password and confirm password do not match' };
                }
                const userData = yield this.iuserRepository.findById(id);
                if (!userData) {
                    return { success: false, message: 'User not found' };
                }
                const isOldPasswordCorrect = yield this.HashPassword.Compare(oldpassword, userData.password);
                if (!isOldPasswordCorrect) {
                    return { success: false, message: 'Incorrect old password' };
                }
                const hashedNewPassword = yield this.HashPassword.Hashing(newpassword);
                const saveUser = yield this.iuserRepository.savehashPassswordbyId(id, hashedNewPassword);
                if (!saveUser) {
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
    profilePicUpdate(id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const imageUrl = await this.Cloudinary.savetocloudinary(imagePath)
                // console.log(imageUrl)
                if (imageUrl) {
                    const saveimage = yield this.iuserRepository.saveimage(id, imageUrl);
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
    EmailChange(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldEmail = yield this.iuserRepository.findEmailById(id);
                if (oldEmail === email) {
                    throw new Error('Old and new email are the same');
                }
                const otp = yield this.GenerateOtp.generateOtp(4);
                const sendMailResult = this.sendMail.SendMail(email, email, otp);
                const updateResult = yield this.iuserRepository.updateEmail(id, email, otp);
                return { success: true, email: email, otp };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    VerificationEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.iuserRepository.findByEmail(email);
                if (!userData) {
                    throw new Error('User not found');
                }
                if (userData.otp === otp) {
                    return { success: true, message: "email successfully verified with OTP" };
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
    getUserCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.iuserRepository.findCourseDeatailsbyId(id);
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
    getUserCourseAccess(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.iuserRepository.findCourseForAccess(id);
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
    addOrders(id, courseId, payment_Info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEnrolled = yield this.iuserRepository.isEnrolled(id, courseId);
                console.log("isEnrolleed", isEnrolled);
                if (isEnrolled) {
                    return { success: false, message: 'The student is already enrolled in this course' };
                }
                console.log("myids", id, courseId);
                const updateEnrolledStudents = yield this.iuserRepository.addEnrolled(id, courseId);
                console.log(updateEnrolledStudents);
                const course = yield this.iuserRepository.findCourseDeatailsbyId(courseId);
                console.log(course);
                if (!course) {
                    return { success: false, message: "Course not found" };
                }
                const updatedOrder = yield this.iuserRepository.updateOrder(id, courseId, payment_Info);
                const updateUser = yield this.iuserRepository.updateStudentsCourse(id, courseId);
                return { success: true, message: "Order updated successfully", updatedOrder, updateEnrolledStudents, updateUser };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred while processing the order" };
            }
        });
    }
    ViewCompletedLessons(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessoncompletionView = yield this.iuserRepository.CompletedLessonView(id, userId);
                return { success: true, message: "lesson view", lessoncompletionView };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred while completeion of lesson" };
            }
        });
    }
    ViewCompletedChapter(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chaptercompletionView = yield this.iuserRepository.CompletedChapterView(id, userId);
                return { success: true, message: "chapter view", chaptercompletionView };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred while completeion of lesson" };
            }
        });
    }
    CompleteLessons(id, lessonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessoncompletion = yield this.iuserRepository.CompletedLesson(id, lessonId, userId);
                return { success: true, message: "lesson completed successfully", lessoncompletion };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred while completeion of lesson" };
            }
        });
    }
    CompleteChapters(id, chapterId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chaptercompletion = yield this.iuserRepository.CompletedChapter(id, chapterId, userId);
                return { success: true, message: "lesson completed successfully", chaptercompletion };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred while completeion of lesson" };
            }
        });
    }
    getEnrolledCourseList(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EnrolledCourses = yield this.iuserRepository.findEnrolledCourses(id);
                if (EnrolledCourses) {
                    return EnrolledCourses;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    finduser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iuserRepository.findUser(id);
                if (user) {
                    return user;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = UserUseCase;

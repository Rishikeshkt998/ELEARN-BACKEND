"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const conversationModel_1 = require("../database/conversationModel");
const courseModel_1 = require("../database/courseModel");
const enrolledStudentsModel_1 = require("../database/enrolledStudentsModel");
const favouriteModel_1 = require("../database/favouriteModel");
const orderModel_1 = require("../database/orderModel");
const userModel_1 = require("../database/userModel");
const mongoose_1 = __importStar(require("mongoose"));
class userRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.userModel.findOne({ email: email });
                if (userData) {
                    return userData;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('findbyemail eror', error);
                return null;
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = new mongoose_1.default.Types.ObjectId(userId);
                const userData = yield userModel_1.userModel.findById(id);
                if (userData) {
                    return userData;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('findbyemail eror', error);
                return null;
            }
        });
    }
    findEmailById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.userModel.findById(id).select('email');
                if (userData && userData.email) {
                    return userData.email;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('findEmailById error', error);
                return null;
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupUser = yield userModel_1.userModel.create(user);
                return signupUser;
            }
            catch (error) {
                console.log('save user error in userRepository:', error);
                return null;
            }
        });
    }
    verifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield userModel_1.userModel.updateOne({ _id: userId }, {
                    $set: {
                        isVerified: true
                    }
                });
                return update;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    updateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.userModel.updateOne({ email: email }, {
                    $set: {
                        otp: otp
                    }
                });
            }
            catch (error) {
            }
        });
    }
    verifyGoogleUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield userModel_1.userModel.findOneAndUpdate({ email: email }, {
                    $set: {
                        isVerified: true
                    }
                });
                return update;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    updateUser(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield userModel_1.userModel.updateOne({ email }, {
                    $set: {
                        otp: otp
                    }
                });
                return update;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    savehashPasssword(email, hashpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveHash = yield userModel_1.userModel.updateOne({ email }, { $set: { password: hashpassword } });
                return saveHash;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    savehashPassswordbyId(id, hashpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveHash = yield userModel_1.userModel.updateOne({ _id: id }, { $set: { password: hashpassword } });
                return saveHash;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield userModel_1.userModel.findById(id);
                return userData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    ProfileEdit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield userModel_1.userModel.findById(id);
                return userData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateUserProfile(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatedBuyer = yield userModel_1.userModel.updateOne({ _id: id }, user, { new: true });
                return updatedBuyer.acknowledged;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    saveimage(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.userModel.findByIdAndUpdate(id, { profileimage: image }, { new: true });
                if (updatedUser) {
                    return updatedUser;
                }
                else {
                    console.error("User not found");
                    return { success: false, message: "User not found" };
                }
            }
            catch (error) {
                console.error("Error saving image to database:", error);
                return { success: false, message: "Internal server error" };
            }
        });
    }
    updateEmail(id, email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatedUser = yield userModel_1.userModel.updateOne({ _id: id }, { email, otp });
                return updatedUser.acknowledged;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    findCourseDeatailsbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseDetails = yield courseModel_1.courseModel.findById(id).populate('reviews.userId').populate('questions').exec();
                return courseDetails;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findCourseForAccess(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseDetails = yield courseModel_1.courseModel.findById(id).populate('reviews.userId').populate('questions').exec();
                return courseDetails;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateOrder(id, courseId, payment_Info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedOrder = yield orderModel_1.orderModel.create({ userId: id, courseId, payment_info: payment_Info });
                return savedOrder;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateStudentsCourse(id, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const updateUser = yield userModel_1.userModel.findByIdAndUpdate(objectId, { $addToSet: { courseIds: courseId.toString() } }, { new: true });
                return updateUser;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateChats(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(courseId);
                if (!course) {
                    return { success: false, message: "course not found" };
                }
                const instructorId = course.instructorId;
                console.log("instructor", instructorId);
                const conversationExist = yield conversationModel_1.conversationModel.findOne({
                    members: { $all: [userId, instructorId] }
                });
                if (conversationExist) {
                    return { success: true, conversationExist };
                }
                const newConversation = new conversationModel_1.conversationModel({ members: [userId, instructorId] });
                return yield newConversation.save();
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updateWhishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield favouriteModel_1.favouriteModel.findOneAndUpdate({ studentId: userId }, { $pull: { favourites: courseId } });
                if (!result) {
                    return { success: false, message: "course not found" };
                }
                return { success: true, result };
                ;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    addEnrolled(id, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newenrolled = new enrolledStudentsModel_1.enrolledStudentsModel({
                    courseId: courseId,
                    studentId: id
                });
                const savedenrolled = yield newenrolled.save();
                return savedenrolled;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isEnrolled(id, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield enrolledStudentsModel_1.enrolledStudentsModel.findOne({ studentId: id, courseId: courseId });
                return result;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    CompletedLessonView(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isLesson = yield enrolledStudentsModel_1.enrolledStudentsModel.findOne({ courseId: id, studentId: userId });
                if (!isLesson) {
                    return;
                }
                const completedLessons = isLesson.completedLessons;
                return completedLessons;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    CompletedChapterView(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isChapter = yield enrolledStudentsModel_1.enrolledStudentsModel.findOne({ courseId: id, studentId: userId });
                if (!isChapter) {
                    console.log("no course");
                    return;
                }
                const completedChapters = isChapter.completedChapters;
                return completedChapters;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    CompletedLesson(id, lessonId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonObjectId = new mongoose_1.Types.ObjectId(lessonId);
                const result = yield enrolledStudentsModel_1.enrolledStudentsModel.findOneAndUpdate({ courseId: id, studentId: userId }, { $addToSet: { completedLessons: lessonObjectId } }, { new: true });
                return result;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    CompletedChapter(id, chapterId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapterObjectId = new mongoose_1.Types.ObjectId(chapterId);
                const result = yield enrolledStudentsModel_1.enrolledStudentsModel.findOneAndUpdate({ courseId: id, studentId: userId }, { $addToSet: { completedChapters: chapterObjectId } }, { new: true });
                return result;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    CompletedChapterTime(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield enrolledStudentsModel_1.enrolledStudentsModel.findOneAndUpdate({ courseId: id, studentId: userId }, { $set: { completedDate: new Date(), courseStatus: true } }, { new: true });
                return result;
            }
            catch (error) {
                console.error('Error checking enrollment status:', error);
                return false;
            }
        });
    }
    findEnrolledCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield enrolledStudentsModel_1.enrolledStudentsModel.find({ studentId: id })
                    .populate('courseId')
                    .exec();
                return enrolledCourses;
            }
            catch (error) {
                console.error('Error finding enrolled courses:', error);
                throw error;
            }
        });
    }
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(id);
                const userData = yield userModel_1.userModel.findById(objectId);
                if (userData) {
                    return userData;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('findbyemail eror', error);
                return null;
            }
        });
    }
}
exports.default = userRepository;

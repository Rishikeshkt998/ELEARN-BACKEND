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
const courseModel_1 = require("../database/courseModel");
const enrolledStudentsModel_1 = require("../database/enrolledStudentsModel");
const trainerModel_1 = require("../database/trainerModel");
const userModel_1 = require("../database/userModel");
class trainerRepository {
    findTrainerByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerData = yield trainerModel_1.trainerModel.findOne({ email: email });
                console.log('trainerData', trainerData);
                if (trainerData) {
                    return trainerData;
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
    findByEmailTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerData = yield trainerModel_1.trainerModel.findOne({ email: email });
                console.log('userData', trainerData);
                if (trainerData) {
                    return trainerData;
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
    findTutorById(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(tutorId);
                const tutorData = yield trainerModel_1.trainerModel.findById(tutorId);
                console.log('userData', tutorData);
                if (tutorData) {
                    return tutorData;
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
    verifyTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield trainerModel_1.trainerModel.updateOne({ _id: tutorId }, {
                    $set: {
                        isVerifiedUser: true
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
    updateTrainerOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield trainerModel_1.trainerModel.updateOne({ email: email }, {
                    $set: {
                        otp: otp
                    }
                });
            }
            catch (error) {
            }
        });
    }
    saveTrainer(trainer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupTrainer = yield trainerModel_1.trainerModel.create(trainer);
                return signupTrainer;
            }
            catch (error) {
                console.log('save trainer error in trainerRepository:', error);
                return null;
            }
        });
    }
    updateTutor(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const update = yield trainerModel_1.trainerModel.updateOne({ email }, {
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
                const saveHash = yield trainerModel_1.trainerModel.updateOne({ email }, { $set: { password: hashpassword } });
                return saveHash;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTrainerProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let trainerData = yield trainerModel_1.trainerModel.findById(id);
                return trainerData;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    TrainerProfileEdit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let trainerData = yield trainerModel_1.trainerModel.findById(id);
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
                let updatedTrainer = yield trainerModel_1.trainerModel.updateOne({ _id: id }, trainer, { new: true });
                return updatedTrainer.acknowledged;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    Trainersaveimage(id, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedTrainer = yield trainerModel_1.trainerModel.findByIdAndUpdate(id, { image: image }, { new: true });
                if (updatedTrainer) {
                    return updatedTrainer;
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
    savehashPasswordbyId(id, hashpassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveHash = yield trainerModel_1.trainerModel.updateOne({ _id: id }, { $set: { password: hashpassword } });
                return saveHash;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findTrainerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(id);
                const trainerData = yield trainerModel_1.trainerModel.findById(id);
                console.log('trainerData', trainerData);
                if (trainerData) {
                    return trainerData;
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
    findEnrolledStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledStudents = yield enrolledStudentsModel_1.enrolledStudentsModel.find();
                const enrolledStudentsDetails = [];
                for (const enrolledStudent of enrolledStudents) {
                    const user = yield userModel_1.userModel.findById(enrolledStudent.studentId);
                    const course = yield courseModel_1.courseModel.findById(enrolledStudent.courseId);
                    enrolledStudentsDetails.push({ user, course });
                }
                return { enrolledStudentsDetails, enrolledStudents };
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    Shedulemeeting(id, meetingDate, meetingTime, meetingCode, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(id);
                if (!course) {
                    throw new Error('Course not found');
                }
                course.meeting = {
                    meetingDate,
                    meetingTime,
                    meetingCode,
                    description
                };
                yield course.save();
                return course;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findCoursesTutor() {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.courseModel.find({ meeting: { $exists: true }, isDeleted: false, adminVerified: true });
            const findCourse = course.map((course) => ({
                _id: course._id,
                category: course.category,
                price: course.price,
                estimatedPrice: course.estimatedPrice,
                name: course.name,
                level: course.level,
                demoUrl: course.demoUrl,
                instructor: course.instructor,
                instructorId: course.instructorId,
                instructorName: course.instructorName,
                description: course.description,
                tags: course.tags,
                thumbnail: course.thumbnail,
                chapters: course.chapters,
                prerequisite: course.prerequisite,
                benefits: course.benefits,
                approved: course.approved,
                listed: course.listed,
                image: course.image,
                adminVerified: course.adminVerified,
                publish: course.publish,
                rating: course.rating,
                noOfPurchase: course.noOfPurchase,
                isDeleted: course.isDeleted,
                meeting: course.meeting,
                reviews: course.reviews
            }));
            return findCourse;
        });
    }
}
exports.default = trainerRepository;

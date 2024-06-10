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
const mongoose_1 = __importDefault(require("mongoose"));
const courseModel_1 = require("../database/courseModel");
const trainerModel_1 = require("../database/trainerModel");
const categoryModel_1 = require("../database/categoryModel");
const chapterModel_1 = __importDefault(require("../database/chapterModel"));
const questionModel_1 = require("../database/questionModel");
const enrolledStudentsModel_1 = require("../database/enrolledStudentsModel");
const userModel_1 = require("../database/userModel");
const orderModel_1 = require("../database/orderModel");
class courseRepository {
    findCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.categoryModel.find({ isHidden: false });
            const findCategory = categories.map((category) => ({
                id: category._id,
                name: category.name,
                description: category.description,
                isHidden: category.isHidden,
                nooOfcourses: category.nooOfcourses,
                status: category.status
            }));
            return findCategory;
        });
    }
    findCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.courseModel.find({ isDeleted: false, adminVerified: true, publish: true });
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
                reviews: course.reviews,
                questions: course.questions,
                createdAt: course.createdAt,
            }));
            return findCourse;
        });
    }
    findCoursestutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.courseModel.find({ instructorId: id });
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
                reviews: course.reviews,
                questions: course.questions,
                createdAt: course.createdAt,
            }));
            return findCourse;
        });
    }
    courseAdd(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.create(formData);
                return course;
            }
            catch (error) {
                console.log('save user error in courseRepository:', error);
                return null;
            }
        });
    }
    courseContentAdd(CourseContentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapter = new chapterModel_1.default({
                    chapters: CourseContentData,
                });
                yield chapter.save();
                return chapter;
            }
            catch (error) {
                console.log('save user error in courseRepository:', error);
                return null;
            }
        });
    }
    courseEdit(id, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.updateOne({ _id: id }, formData);
                return course;
            }
            catch (error) {
                console.log('edit course error in courseRepository:', error);
                return null;
            }
        });
    }
    courseContentEdit(courseId, CourseContentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapter = yield chapterModel_1.default.findById(courseId);
                if (!chapter) {
                    throw new Error('Chapter not found');
                }
                chapter.chapters = CourseContentData;
                yield chapter.save();
                return chapter;
            }
            catch (error) {
                console.log('save user error in courseRepository:', error);
                return null;
            }
        });
    }
    publishById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourseContent = yield courseModel_1.courseModel.findByIdAndUpdate(id, { publish: true });
                return updatedCourseContent;
            }
            catch (error) {
                console.log('save user error in courseRepository:', error);
                return null;
            }
        });
    }
    getChapterbyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let chapters = yield chapterModel_1.default
                .find({ course: id })
                .populate("lessons").populate({ path: 'course', populate: { path: 'category' } })
                .sort("order");
            if (chapters) {
                return chapters;
            }
            else {
                return null;
            }
        });
    }
    ChapterAdd(title, order, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield chapterModel_1.default.create({ title: title, course: id, order: order });
                return course;
            }
            catch (error) {
                console.log('save user error in courseRepository:', error);
                return null;
            }
        });
    }
    findEditCoursebyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseDetails = yield courseModel_1.courseModel.findById(id);
                return courseDetails;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findByIdAndUpdate(id, { isDeleted: true });
                if (!course) {
                    throw new Error('Course not found');
                }
                return course;
            }
            catch (error) {
                console.error('Error finding chapters for edit:', error);
                throw error;
            }
        });
    }
    findChaptersForEdit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(id).exec();
                if (!course) {
                    throw new Error('Course not found');
                }
                const chapterIds = course.chapters;
                console.log("chaptrerids", chapterIds);
                const chapters = yield chapterModel_1.default.find({ _id: { $in: chapterIds } }).exec();
                console.log("chapters", chapters);
                return chapters;
            }
            catch (error) {
                console.error('Error finding chapters for edit:', error);
                throw error;
            }
        });
    }
    reviewAdd(id, courseId, reviews, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(courseId);
                const data = {
                    userId: id,
                    comments: reviews,
                    rating: rating
                };
                const updated = yield courseModel_1.courseModel.updateOne({ _id: courseId }, { $push: { reviews: data } });
                console.log("Reviews updated successfully.");
                return updated;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reviewEdit(id, courseId, reviews, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(courseId);
                if (!course) {
                    throw new Error('Course not found');
                }
                const userId = new mongoose_1.default.Types.ObjectId(id);
                const courseid = new mongoose_1.default.Types.ObjectId(courseId);
                const updatedCourse = yield courseModel_1.courseModel.updateOne({ _id: courseid, 'reviews.userId': userId }, { $set: { 'reviews.$.comments': reviews, 'reviews.$.rating': rating } });
                console.log("updated", updatedCourse);
                if (!updatedCourse) {
                    throw new Error('Failed to update course with review');
                }
                console.log("Reviews updated successfully.");
                return { success: true, message: 'Reviews updated successfully.' };
            }
            catch (error) {
                console.error('Error in reviewEdit:', error);
            }
        });
    }
    reviewFetch(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield courseModel_1.courseModel.findById(id).populate('reviews.userId');
                return course;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AddReply(reviewId, replyText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedReview = yield courseModel_1.courseModel.findOneAndUpdate({ 'reviews._id': reviewId }, { $push: { 'reviews.$.commentreplies': replyText } }, { new: true });
                return updatedReview;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    QuestionAdd(question, options, correctOption, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield questionModel_1.questionModel.create({
                question,
                options,
                correctOption,
                courseId,
            });
            yield courseModel_1.courseModel.findOneAndUpdate({ _id: courseId }, {
                $push: {
                    questions: questions._id,
                },
            }, {
                upsert: true,
            });
            return questions;
        });
    }
    Getquestions(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield questionModel_1.questionModel.find({ courseId: courseId });
                if (questions) {
                    return questions;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    QuestionAnswer(questionId, answer, courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const correctAnswer = yield questionModel_1.questionModel.findOne({
                    _id: questionId,
                    correctOption: { $eq: answer },
                });
                if (correctAnswer) {
                    yield enrolledStudentsModel_1.enrolledStudentsModel.findOneAndUpdate({ courseId: courseId, studentId }, { $push: { attendedQuestions: questionId } }, {
                        upsert: true,
                    });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    CourseDataforAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield courseModel_1.courseModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getTotalCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [coursesResult, usersResult, tutorsResult, salesResult] = yield Promise.all([
                    courseModel_1.courseModel.aggregate([{ $count: "totalCourses" }]),
                    userModel_1.userModel.aggregate([{ $count: "totalUsers" }]),
                    trainerModel_1.trainerModel.aggregate([{ $count: "totalTutors" }]),
                    orderModel_1.orderModel.aggregate([{ $count: "totalSales" }])
                ]);
                const totalCourses = coursesResult.length > 0 ? coursesResult[0].totalCourses : 0;
                const totalUsers = usersResult.length > 0 ? usersResult[0].totalUsers : 0;
                const totalTutors = tutorsResult.length > 0 ? tutorsResult[0].totalTutors : 0;
                const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
                console.log(`Total number of courses: ${totalCourses}`);
                console.log(`Total number of users: ${totalUsers}`);
                console.log(`Total number of tutors: ${totalTutors}`);
                console.log(`Total number of sales: ${totalSales}`);
                return {
                    totalCourses,
                    totalUsers,
                    totalTutors,
                    totalSales
                };
            }
            catch (error) {
                console.error('Error counting documents:', error);
                throw error;
            }
        });
    }
    getTotalCountsTutor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield courseModel_1.courseModel.find({ instructorId });
                const courseIds = courses.map((course) => course._id);
                const coursesResult = yield courseModel_1.courseModel.countDocuments({ instructorId });
                const usersResult = yield userModel_1.userModel.countDocuments({
                    courseIds: { $in: courseIds }
                });
                const tutorsResult = yield trainerModel_1.trainerModel.countDocuments({ _id: instructorId });
                const salesResult = yield orderModel_1.orderModel.countDocuments({ courseId: { $in: courseIds } });
                const totalAmountResult = yield orderModel_1.orderModel.aggregate([
                    { $match: { courseId: { $in: courseIds } } },
                    { $group: { _id: null, totalAmount: { $sum: "$payment_info.amount" } } }
                ]);
                const totalCourses = coursesResult;
                const totalUsers = usersResult;
                const totalTutors = tutorsResult;
                const totalSales = salesResult;
                const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
                console.log(`Total number of courses: ${totalCourses}`);
                console.log(`Total number of users: ${totalUsers}`);
                console.log(`Total number of tutors: ${totalTutors}`);
                console.log(`Total number of sales: ${totalSales}`);
                console.log(`Total amount: ${totalAmount}`);
                return {
                    totalCourses,
                    totalUsers,
                    totalTutors,
                    totalSales,
                    totalAmount
                };
            }
            catch (error) {
                console.error('Error counting documents:', error);
                throw error;
            }
        });
    }
    findEnrolledCourses(id, usersId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enrolledCourses = yield enrolledStudentsModel_1.enrolledStudentsModel.find({ studentId: usersId, courseId: id });
                return enrolledCourses;
            }
            catch (error) {
                console.error('Error finding enrolled courses:', error);
                throw error;
            }
        });
    }
    UserDataforAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield userModel_1.userModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    OrderDataforAnalysis() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield orderModel_1.orderModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    CourseDataAnalysisTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield courseModel_1.courseModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                        instructorId: id,
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    OrderDataAnalysisForTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const courses = yield courseModel_1.courseModel.find({ instructorId: tutorId });
                    const courseIds = courses.map((course) => course._id);
                    const count = yield orderModel_1.orderModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                        courseId: { $in: courseIds },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    UserDataAnalysisForTutor(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const courses = yield courseModel_1.courseModel.find({
                        instructorId: tutorId,
                    });
                    const courseIds = courses.map((course) => course._id);
                    const count = yield userModel_1.userModel.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate }, courseIds: { $in: courseIds }
                    });
                    last12Months.push({ month: monthYear, count });
                    console.log(last12Months);
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    SearchCourses(search, category, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = { isDeleted: false };
                if (category) {
                    query.category = category;
                }
                if (search) {
                    query.$or = [
                        { name: { $regex: new RegExp(search, "i") } },
                        { description: { $regex: new RegExp(search, "i") } }
                    ];
                }
                const sortOptions = {};
                if (price !== "") {
                    sortOptions.price = price === "desc" ? -1 : 1;
                }
                const matchingCourses = yield courseModel_1.courseModel
                    .find(query)
                    .sort(sortOptions);
                return matchingCourses;
            }
            catch (error) {
                console.error('Error searching courses:', error);
                throw error;
            }
        });
    }
}
exports.default = courseRepository;

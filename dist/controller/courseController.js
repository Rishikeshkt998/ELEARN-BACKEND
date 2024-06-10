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
class courseController {
    constructor(courseCase) {
        this.courseCase = courseCase;
    }
    Categoryshow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.courseCase.showCategories();
                if (category) {
                    return res.status(200).json(category);
                }
                else {
                    return res.status(401).json({ success: false, message: 'category not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    Courseshow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseCase.showCourse();
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
    CourseshowAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseCase.showCourseForAdmin();
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
    Courseshows(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const course = yield this.courseCase.showCourses(id);
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
    addCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formData = req.body;
                const Response = yield this.courseCase.AddCourse(formData);
                if (Response) {
                    res.status(200).json({ success: true, message: 'added course data', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in adding couse data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    EditCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.courseId;
                const data = req.body;
                const Response = yield this.courseCase.EditCourseDetails(courseId, data);
                if (Response) {
                    res.status(200).json({ success: true, message: 'Edited the course data', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in editing couse data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    DeleteCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const Response = yield this.courseCase.CourseDelete(id);
                if (Response) {
                    res.status(200).json({ success: true, message: 'successfully deleted course', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in deleting  couse data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    EditDisplayCoursebyId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.courseId;
                const Response = yield this.courseCase.EditCoursePagedisplaybyId(id);
                if (Response) {
                    res.status(200).json({ success: true, message: 'added course data', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in adding couse data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    DisplayChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.courseId;
                const Response = yield this.courseCase.EditDisplayChapters(id);
                if (Response) {
                    res.status(200).json({ success: true, message: 'edited course', Response });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in editing chapters' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    getChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let courseId = req.query.id;
                let chapters = yield this.courseCase.getChapters(courseId);
                res.status(200).json(chapters);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    publishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let publish = yield this.courseCase.publishCourses(id);
                if (publish === null || publish === void 0 ? void 0 : publish.status) {
                    res.status(200).json(publish);
                }
                else {
                    res.status(401).json(publish);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, id, order } = req.body;
                const Response = yield this.courseCase.AddChapter(title, id, order);
                if (Response) {
                    res.status(200).json({ success: true, message: 'added chapter data' });
                }
                else {
                    res.status(200).json({ success: true, message: 'error in adding chapter data' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    AddReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, id, reviews, rating } = req.body;
                const addreviews = yield this.courseCase.reviewAdd(userId, id, reviews, rating);
                if (addreviews) {
                    res.status(200).json({ success: true, addreviews });
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
    EditReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, id, reviews, rating } = req.body;
                const editreviews = yield this.courseCase.reviewEdit(userId, id, reviews, rating);
                if (editreviews) {
                    res.status(200).json({ success: true, editreviews });
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
    getReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const fetchreviews = yield this.courseCase.fetchReviews(id);
                if (fetchreviews) {
                    res.status(200).json({ success: true, fetchreviews });
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
    addReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId, replyText } = req.body;
                const reviewreply = yield this.courseCase.ReplyAdd(reviewId, replyText);
                if (reviewreply) {
                    res.status(200).json({ success: true, reviewreply });
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
    TotalCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.courseCase.TotalCount();
                if (count) {
                    res.status(200).json({ success: true, count });
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
    TotalTutorCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const count = yield this.courseCase.TotalTutorCount(id);
                if (count) {
                    res.status(200).json({ success: true, count });
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
    courseAnalysis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseCase.AnalysisCourse();
                if (course) {
                    res.status(200).json({ success: true, course });
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
    userAnalysis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.courseCase.AnalysisUser();
                if (user) {
                    res.status(200).json({ success: true, user });
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
    orderAnalysis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.courseCase.AnalysisOrder();
                if (order) {
                    res.status(200).json({ success: true, order });
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
    courseAnalysisForTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const course = yield this.courseCase.AnalysisCourseTutor(id);
                if (course) {
                    res.status(200).json({ success: true, course });
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
    userAnalysisForTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const user = yield this.courseCase.AnalysisUserTutor(id);
                if (user) {
                    res.status(200).json({ success: true, user });
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
    orderAnalysisForTutor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const order = yield this.courseCase.AnalysisOrderTutor(id);
                if (order) {
                    res.status(200).json({ success: true, order });
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
    QuestionAdd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question, options, correctOption, courseId } = req.body;
                const response = yield this.courseCase.AddQuestion(question, options, correctOption, courseId);
                if (response.status) {
                    res.status(200).json(response);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    GetQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.id;
                const response = yield this.courseCase.QuestionGet(courseId);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
                }
                else {
                    res.status(200).json(response);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    QuestionAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questionId = req.body.questionId;
                const answer = req.body.answer;
                const courseId = req.body.id;
                const studentId = req.body.usersId;
                const response = yield this.courseCase.AnswerQuestion(questionId, answer, courseId, studentId);
                if (response === null || response === void 0 ? void 0 : response.status) {
                    res.status(200).json(response);
                }
                else {
                    res.status(200).json(response);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    GetEnrolled(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const usersId = req.params.usersId;
                const EnrolledCourses = yield this.courseCase.getEnrolledCourse(id, usersId);
                if (EnrolledCourses) {
                    return res.status(200).json({ success: true, EnrolledCourses });
                }
                else {
                    return res.status(401).json({ success: false, message: 'enrolled students  not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    CourseSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.searchTerm;
                const category = req.query.category;
                const price = req.query.price;
                const result = yield this.courseCase.SearchCourses(search, category, price);
                if (result)
                    res.json({ success: true, data: result, message: 'Successfully searched course' });
                else
                    res.json({ success: false, message: "somthing went wrong while fetching the job details!" });
            }
            catch (error) {
                console.log(error);
                res.json({ success: false, message: 'Internal server error occured!' });
            }
        });
    }
}
exports.default = courseController;

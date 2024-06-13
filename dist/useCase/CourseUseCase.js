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
Object.defineProperty(exports, "__esModule", { value: true });
class courseUseCase {
    constructor(IcourseRepository, Cloudinary) {
        this.IcourseRepository = IcourseRepository,
            this.Cloudinary = Cloudinary;
    }
    showCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.IcourseRepository.findCategories();
                if (category) {
                    return category;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    showCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.findCourses();
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
    showCourseForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.findCoursesView();
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
    showCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.findCoursestutor(id);
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
    AddCourse(courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(courseData);
                const { courseContentData } = courseData, mainData = __rest(courseData, ["courseContentData"]);
                const courseContentResponse = yield this.IcourseRepository.courseContentAdd(courseContentData);
                if (!courseContentResponse) {
                    throw new Error('Failed to save courseContentData');
                }
                mainData.chapters = courseContentResponse._id;
                const imageUrl = yield this.Cloudinary.savetocloudinary(mainData.thumbnail);
                mainData.thumbnail = imageUrl;
                const mainDataResponse = yield this.IcourseRepository.courseAdd(mainData);
                if (!mainDataResponse) {
                    throw new Error('Failed to save main data');
                }
                console.log('Successfully added course data');
                return { success: true, mainDataResponse, courseContentResponse };
            }
            catch (error) {
                console.error('Error during course data adding:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    EditCourseDetails(courseId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
                const { courseContentData } = data, mainData = __rest(data, ["courseContentData"]);
                const imageUrl = yield this.Cloudinary.savetocloudinary(mainData.thumbnail);
                mainData.thumbnail = imageUrl;
                const mainDataResponse = yield this.IcourseRepository.courseEdit(courseId, mainData);
                if (!mainDataResponse) {
                    throw new Error('Failed to save main data');
                }
                const chapter = yield this.IcourseRepository.findEditCoursebyId(courseId);
                let chapterId = chapter.chapters._id;
                console.log(chapter);
                const courseContentResponse = yield this.IcourseRepository.courseContentEdit(chapterId, courseContentData);
                if (!courseContentResponse) {
                    throw new Error('Failed to save courseContentData');
                }
                return { success: true, mainDataResponse, courseContentResponse };
            }
            catch (error) {
                console.error('Error during course data editing:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    getChapters(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let chapters = yield this.IcourseRepository.getChapterbyId(id);
                return { chapters: chapters };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AddChapter(title, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.IcourseRepository.ChapterAdd(title, id, order);
                if (response) {
                    console.log('successsfull updated data');
                }
                return response;
            }
            catch (error) {
                console.error('Error during chapter data adding:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    EditCoursePagedisplaybyId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.findEditCoursebyId(id);
                console.log(course);
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
    EditDisplayChapters(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chapters = yield this.IcourseRepository.findChaptersForEdit(id);
                console.log(chapters);
                if (chapters) {
                    return chapters;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    publishCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let chapter = yield ((_a = this.IcourseRepository) === null || _a === void 0 ? void 0 : _a.findChaptersForEdit(id));
                console.log(chapter);
                if (chapter) {
                    let published = yield this.IcourseRepository.publishById(id);
                    console.log(published);
                    return { status: true, message: "published succesfully", published };
                }
                else {
                    throw new Error("could not find chapter");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    CourseDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteddata = yield this.IcourseRepository.deleteById(id);
                console.log(deleteddata);
                if (deleteddata) {
                    return deleteddata;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reviewAdd(userId, id, reviews, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewresult = yield this.IcourseRepository.reviewAdd(userId, id, reviews, rating);
                console.log(reviewresult);
                if (reviewresult) {
                    return reviewresult;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    reviewEdit(userId, id, reviews, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewresult = yield this.IcourseRepository.reviewEdit(userId, id, reviews, rating);
                console.log(reviewresult);
                if (reviewresult) {
                    return reviewresult;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    fetchReviews(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchreview = yield this.IcourseRepository.reviewFetch(id);
                console.log(fetchreview);
                if (fetchreview) {
                    return fetchreview;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ReplyAdd(reviewId, replyText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replyadd = yield this.IcourseRepository.AddReply(reviewId, replyText);
                console.log(replyadd);
                if (replyadd) {
                    return replyadd;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TotalCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.IcourseRepository.getTotalCounts();
                console.log(count);
                if (count) {
                    return count;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TotalTutorCount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.IcourseRepository.getTotalCountsTutor(id);
                console.log(count);
                if (count) {
                    return count;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AnalysisCourse() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.CourseDataforAnalysis();
                console.log(course);
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
    AnalysisOrder() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.IcourseRepository.OrderDataforAnalysis();
                console.log(order);
                if (order) {
                    return order;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AnalysisUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.IcourseRepository.UserDataforAnalysis();
                console.log(user);
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
    AnalysisCourseTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.IcourseRepository.CourseDataAnalysisTutor(id);
                console.log(course);
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
    AnalysisOrderTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.IcourseRepository.OrderDataAnalysisForTutor(id);
                console.log(order);
                if (order) {
                    return order;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AnalysisUserTutor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.IcourseRepository.UserDataAnalysisForTutor(id);
                console.log(user);
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
    AddQuestion(question, options, correctOption, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield this.IcourseRepository.QuestionAdd(question, options, correctOption, courseId);
            return { status: true, questions };
        });
    }
    QuestionGet(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield this.IcourseRepository.Getquestions(courseId);
                if (questions) {
                    return { status: true, questions };
                }
                else {
                    return { status: false };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    AnswerQuestion(questionId, answer, courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.IcourseRepository.QuestionAnswer(questionId, answer, courseId, studentId);
                if (response) {
                    return { status: true, message: 'yayy!!!' };
                }
                else {
                    return { status: false, message: "oops wrong answer" };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getEnrolledCourse(id, usersId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const EnrolledCourses = yield this.IcourseRepository.findEnrolledCourses(id, usersId);
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
    SearchCourses(search, category, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchresult = yield this.IcourseRepository.SearchCourses(search, category, price);
                console.log(searchresult);
                if (searchresult) {
                    return searchresult;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isCourseCompleted(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.IcourseRepository.isCourseCompleted(courseId, studentId);
                if (response) {
                    return { response };
                }
                else {
                    return { response };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = courseUseCase;

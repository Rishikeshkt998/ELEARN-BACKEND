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
const adminModel_1 = require("../database/adminModel");
const userModel_1 = require("../database/userModel");
const categoryModel_1 = require("../database/categoryModel");
const trainerModel_1 = require("../database/trainerModel");
const courseModel_1 = require("../database/courseModel");
class adminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield adminModel_1.adminModel.findOne({ email: email });
                console.log('adminData', adminData);
                if (adminData) {
                    return adminData;
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
    findAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield adminModel_1.adminModel.findById(id);
                console.log('adminData', adminData);
                if (adminData) {
                    return adminData;
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
    saveAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupAdmin = yield adminModel_1.adminModel.create(admin);
                return signupAdmin;
            }
            catch (error) {
                console.log('save admin error in userRepository:', error);
                return null;
            }
        });
    }
    findUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.userModel.find();
            const findeduser = userData.map((user) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone,
                profileimage: user.profileimage,
                otp: user.otp,
                isVerified: user.isVerified,
                isBlocked: user.isBlocked,
                courseIds: user.courseIds
            }));
            return findeduser;
        });
    }
    CourseFind() {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield courseModel_1.courseModel.find({ isDeleted: false });
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
                isDeleted: course.isDeleted
            }));
            return findCourse;
        });
    }
    findTutor() {
        return __awaiter(this, void 0, void 0, function* () {
            const trainerData = yield trainerModel_1.trainerModel.find();
            const findedtrainer = trainerData.map((trainer) => ({
                id: trainer._id,
                name: trainer.name,
                email: trainer.email,
                password: trainer.password,
                phone: trainer.phone,
                dateOfBirth: trainer.dateOfBirth,
                isVerified: trainer.isVerified,
                isBlocked: trainer.isBlocked
            }));
            return findedtrainer;
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userModel_1.userModel.findById(id);
            if (user) {
                yield userModel_1.userModel.findByIdAndUpdate(id, { $set: { isBlocked: true } });
                return true;
            }
            return false;
        });
    }
    verifyTrainer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let trainer = yield trainerModel_1.trainerModel.findById(id);
            if (trainer) {
                yield trainerModel_1.trainerModel.findByIdAndUpdate(id, { $set: { isVerified: !trainer.isVerified } });
                return true;
            }
            return false;
        });
    }
    unverifyTrainer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let trainer = yield trainerModel_1.trainerModel.findById(id);
            if (trainer) {
                yield trainerModel_1.trainerModel.findByIdAndUpdate(id, { $set: { isVerified: false } });
                return true;
            }
            return false;
        });
    }
    verifyCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let course = yield courseModel_1.courseModel.findById(id);
            if (course) {
                yield courseModel_1.courseModel.findByIdAndUpdate(id, { $set: { adminVerified: true } });
                return true;
            }
            return false;
        });
    }
    unverifyCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let course = yield courseModel_1.courseModel.findById(id);
            if (course) {
                const vertfy = yield courseModel_1.courseModel.findByIdAndUpdate(id, { $set: { adminVerified: false } });
                console.log(vertfy);
                return true;
            }
            return false;
        });
    }
    unblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userModel_1.userModel.findById(id);
            if (user) {
                yield userModel_1.userModel.findByIdAndUpdate(id, { $set: { isBlocked: false } });
                return true;
            }
            return false;
        });
    }
    saveCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryexists = yield categoryModel_1.categoryModel.findOne({ name });
                if (categoryexists) {
                    return { duplicate: true, success: true };
                }
                const newcategory = new categoryModel_1.categoryModel({ name, description, isHidden: false });
                yield newcategory.save();
                return { duplicate: false, success: true };
            }
            catch (error) {
                console.log(error);
                return { duplicate: false, success: false };
            }
        });
    }
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
    findCategorybyid(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = yield categoryModel_1.categoryModel.findById(id);
                console.log('categoryData', categoryData);
                if (categoryData) {
                    return categoryData;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log('category eror', error);
                return null;
            }
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = yield categoryModel_1.categoryModel.findById(id);
                if (category) {
                    yield categoryModel_1.categoryModel.findByIdAndUpdate(id, { $set: { isHidden: true } });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    editCategory(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCategory = yield categoryModel_1.categoryModel.findById(id);
                if (!existingCategory) {
                    return false;
                }
                const categoryWithSameName = yield categoryModel_1.categoryModel.findOne({ name, _id: { $ne: id } });
                if (categoryWithSameName) {
                    return false;
                }
                existingCategory.name = name;
                existingCategory.description = description;
                yield existingCategory.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = adminRepository;

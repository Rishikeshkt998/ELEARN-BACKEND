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
class adminUseCase {
    constructor(iAdminRepository, JwtToken, HashPassword) {
        this.iAdminRepository = iAdminRepository,
            this.JwtToken = JwtToken;
        this.HashPassword = HashPassword;
    }
    AdminSignUp(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = admin.email;
                const isAdmin = yield this.iAdminRepository.findAdminByEmail(email);
                if (isAdmin) {
                    return { success: false, message: 'This Email is already exists' };
                }
                else {
                    const hashedPassword = yield this.HashPassword.Hashing(admin.password);
                    admin.password = hashedPassword;
                    const adminSave = yield this.iAdminRepository.saveAdmin(admin);
                    if (!adminSave) {
                        return { success: false, message: 'Something went wrong while saving admin data' };
                    }
                    else {
                        return { success: true, message: 'admin successfully signed up' };
                    }
                }
            }
            catch (error) {
                console.log('User signup error in UserUseCase:', error);
                return { success: false, message: 'Internal server error' };
            }
        });
    }
    LoginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminData = yield this.iAdminRepository.findAdminByEmail(email);
                if (adminData) {
                    const matched = yield this.HashPassword.Compare(password, adminData.password);
                    if (matched) {
                        const token = yield this.JwtToken.SignJwt(adminData._id, "admin");
                        // const token = await this.JwtToken.SignJwt(adminData)
                        return { success: true, adminData: adminData, token: token };
                    }
                    else {
                        return { success: false, message: 'password is wrong' };
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
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.iAdminRepository.findUser();
                if (users) {
                    return users;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    ViewCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.iAdminRepository.CourseFind();
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
    getTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainer = yield this.iAdminRepository.findTutor();
                if (trainer) {
                    return trainer;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.iAdminRepository.blockUser(id);
                return blocked;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    trainerVerify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let verified = yield this.iAdminRepository.verifyTrainer(id);
                return verified;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    TrainerUnverify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let unverified = yield this.iAdminRepository.unverifyTrainer(id);
                return unverified;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    CourseVerify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let verifiedcourse = yield this.iAdminRepository.verifyCourse(id);
                return verifiedcourse;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    CourseunVerify(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let unverifiedcourse = yield this.iAdminRepository.unverifyCourse(id);
                return unverifiedcourse;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let unblocked = yield this.iAdminRepository.unblockUser(id);
                return unblocked;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedcategory = yield this.iAdminRepository.saveCategory(name, description);
                if (savedcategory) {
                    return savedcategory;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    displayCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.iAdminRepository.findCategories();
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
    editDisplay(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.iAdminRepository.findCategorybyid(id);
                console.log(category);
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
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedcategory = yield this.iAdminRepository.deleteCategory(id);
                console.log(deletedcategory);
                if (deletedcategory) {
                    return deletedcategory;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editCategory(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editcategory = yield this.iAdminRepository.editCategory(id, name, description);
                console.log(editcategory);
                if (editcategory) {
                    return editcategory;
                }
                return null;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = adminUseCase;

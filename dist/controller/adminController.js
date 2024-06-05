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
class adminController {
    constructor(adminCase) {
        this.adminCase = adminCase;
    }
    SignUpAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminData = req.body;
                const admin = yield this.adminCase.AdminSignUp(adminData);
                res.json(admin);
            }
            catch (error) {
                console.log('signup error : ', error);
            }
        });
    }
    AdminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const adminData = yield this.adminCase.LoginAdmin(email, password);
                if (adminData === null || adminData === void 0 ? void 0 : adminData.success) {
                    res.cookie('adminToken', adminData.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                    });
                    return res.status(200).json(adminData);
                }
                else {
                    return res.status(200).json(adminData);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findeduser = yield this.adminCase.getUsers();
                if (findeduser) {
                    return res.status(200).json({ success: true, findeduser });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Users not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    Courses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.adminCase.ViewCourses();
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
    Trainers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findedtrainer = yield this.adminCase.getTutors();
                if (findedtrainer) {
                    return res.status(200).json({ success: true, findedtrainer });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Trainer not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.params.id;
                let blocked = yield this.adminCase.blockUser(userId);
                if (blocked) {
                    console.log(blocked);
                    res.cookie("userToken", "", {
                        httpOnly: true,
                        expires: new Date(0),
                    });
                    res.status(200).json({ success: true, blocked, userId });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    verifyTrainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                console.log(id);
                let verified = yield this.adminCase.trainerVerify(id);
                if (verified) {
                    res.status(200).json({ success: true, message: "trianer is not verified" });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    unVerifyTrainer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let unverify = yield this.adminCase.TrainerUnverify(id);
                if (unverify) {
                    res.status(200).json({ success: true, message: "trainer not verified" });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    verifyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                console.log(id);
                let verified = yield this.adminCase.CourseVerify(id);
                if (verified) {
                    res.status(200).json({ success: true, message: "course verified" });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    unverifyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let id = req.params.id;
                let unverify = yield this.adminCase.CourseunVerify(id);
                if (unverify) {
                    res.status(200).json({ success: true, message: "course unverify" });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    unblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.params.id;
                let unblocked = yield this.adminCase.unblockUser(userId);
                if (unblocked) {
                    res.cookie("userToken", "", {
                        httpOnly: true,
                        expires: new Date(0),
                    });
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    categoryadd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                let savedCategory = yield this.adminCase.addCategory(name, description);
                if (savedCategory === null || savedCategory === void 0 ? void 0 : savedCategory.success) {
                    if (savedCategory === null || savedCategory === void 0 ? void 0 : savedCategory.duplicate) {
                        return res.status(200).json({ success: false, message: 'Category already exists !!' });
                    }
                    else if (!(savedCategory === null || savedCategory === void 0 ? void 0 : savedCategory.duplicate)) {
                        return res.status(200).json({ success: true, message: 'New category added successfully' });
                    }
                }
                else if (!(savedCategory === null || savedCategory === void 0 ? void 0 : savedCategory.success)) {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    showCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.adminCase.displayCategory();
                if (category) {
                    return res.status(200).json(category);
                }
                else {
                    return res.status(401).json({ success: false, message: 'Users not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    editCategoryDisplay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const category = yield this.adminCase.editDisplay(id);
                if (category) {
                    return res.status(200).json({ success: true, category });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Users not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryid = req.params.id;
                console.log(categoryid);
                const category = yield this.adminCase.deleteCategory(categoryid);
                if (category) {
                    return res.status(200).json({ success: true, category });
                }
                else {
                    return res.status(401).json({ success: false, message: 'Users not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    editcategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const { name, description } = req.body;
                if (categoryId) {
                    const updateData = yield this.adminCase.editCategory(categoryId, name, description);
                    if (updateData) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: 'Not updated!' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: "Something went wrong!Try again!" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    adminLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("adminToken", "", {
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
exports.default = adminController;

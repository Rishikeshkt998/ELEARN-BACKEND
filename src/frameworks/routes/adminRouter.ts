import express from "express"
import adminRepository from "../repository/adminRepository"
import adminUseCase from "../../useCase/AdminUseCase"
import adminController from "../../controller/adminController"
import JwtToken from "../services/JwtToken"
import HashPassword from "../services/hashPassword"
import adminAuth from "../middleware/AdminAuth"
import courseRepository from "../repository/courseRepository"
import courseUseCase from "../../useCase/CourseUseCase"
import courseController from "../../controller/courseController"
import Cloudinary from "../services/Cloudinary"
const router = express.Router()

const jwt=new JwtToken()
const hashed=new HashPassword()
const cloud = new Cloudinary()
const repository = new adminRepository()
const adminCase = new adminUseCase(repository,jwt,hashed)
const controller = new adminController(adminCase)
const courseRepo = new courseRepository();
const courseuseCase = new courseUseCase(courseRepo, cloud);
const CourseController = new courseController(courseuseCase);
router.post('/adminSignup', (req, res) => controller.SignUpAdmin(req,res))
router.post('/adminlogin', (req, res) => controller.AdminLogin(req,res))
router.post('/addcategory',adminAuth, (req, res) => controller.categoryadd(req,res))
router.get('/category',adminAuth, (req, res) => controller.showCategory(req,res))
router.get('/editcategory/:id',adminAuth, (req, res) => controller.editCategoryDisplay(req,res))
router.put('/updatecategory/:id',adminAuth, (req, res) => controller.editcategory(req,res))
router.get('/deletecategory/:id',adminAuth, (req, res) => controller.deleteCategory(req, res))
router.get('/users',adminAuth, (req, res) => controller.user(req,res))
router.get('/course', (req, res) => controller.Courses(req, res))
router.get('/trainers',adminAuth, (req, res) => controller.Trainers(req, res))
router.put('/blockuser/:id',adminAuth, (req, res) => controller.blockUser(req,res))
router.put('/unblockuser/:id',adminAuth, (req, res) => controller.unblockUser(req, res))
router.put('/verifytrainer/:id',adminAuth, (req, res) => controller.verifyTrainer(req, res))
router.put('/unverifytrainer/:id',adminAuth,(req, res) => controller.unVerifyTrainer(req, res))
router.put('/verifycourse/:id', adminAuth, (req, res) => controller.verifyCourse(req, res))
router.put('/unverifycourse/:id', adminAuth,  (req, res) => controller.unverifyCourse(req, res))
router.post('/adminlogout',adminAuth,(req, res) => controller.adminLogout(req,res))
//course
router.get('/courseanalysis', (req, res) => CourseController.courseAnalysis(req, res))
router.get('/useranalysis', (req, res) => CourseController.userAnalysis(req, res))
router.get('/orderanalysis', (req, res) => CourseController.orderAnalysis(req, res))
export default router
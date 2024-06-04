import { ObjectId } from "mongoose";
import Admin from "../../domain_entities/admin";
import User from "../../domain_entities/user";

import IadminRepository from "../../useCase/interface/IadminRepository";

import { adminModel } from "../database/adminModel";
import { userModel } from "../database/userModel";
import { categoryModel } from "../database/categoryModel";
import Category from "../../domain_entities/category";
import Trainer from "../../domain_entities/trainer";
import { trainerModel } from "../database/trainerModel";
import Course from "../../domain_entities/course";
import { courseModel } from "../database/courseModel";




class adminRepository implements IadminRepository {
    async findAdminByEmail(email: string) {
        try {
            const adminData = await adminModel.findOne({ email: email })
            console.log('adminData', adminData)
            if (adminData) {
                return adminData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findAdminById(id: string) {
        try {
            const adminData = await adminModel.findById(id)
            console.log('adminData', adminData)
            if (adminData) {
                return adminData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async saveAdmin(admin: Admin) {
        try {
            const signupAdmin = await adminModel.create(admin)
            return signupAdmin
        } catch (error) {
            console.log('save admin error in userRepository:', error);
            return null

        }
    }
    async findUser(): Promise<Admin[]> {
        const userData: (User & { _id: ObjectId })[] = await userModel.find()
        const findeduser: User[] = userData.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            profileimage: user.profileimage,
            otp: user.otp,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked,
            courseIds:user.courseIds

        }));
        return findeduser


    }
    async CourseFind(): Promise<Course[]> {
        const course: (Course & { _id: ObjectId })[] = await courseModel.find({ isDeleted: false })
        const findCourse: Course[] = course.map((course) => ({
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


        return findCourse

    }
    async findTutor(): Promise<Trainer[]> {
        const trainerData: (Trainer & { _id: ObjectId })[] = await trainerModel.find()
        const findedtrainer: Trainer[] = trainerData.map((trainer) => ({
            id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            password: trainer.password,
            phone: trainer.phone,
            dateOfBirth: trainer.dateOfBirth,
            isVerified: trainer.isVerified,
            isBlocked: trainer.isBlocked

        }));
        return findedtrainer

        
    }
    async blockUser(id: string): Promise<boolean> {
        let user = await userModel.findById(id);
        if (user) {
            await userModel.findByIdAndUpdate(id, { $set: { isBlocked: true } })
            return true
        }
        return false
    }
    async verifyTrainer(id: string): Promise<boolean> {
        let trainer = await trainerModel.findById(id);
        if (trainer) {
            await trainerModel.findByIdAndUpdate(id, { $set: { isVerified: !trainer.isVerified } })
            return true
        }
        return false
    }
    async unverifyTrainer(id: string): Promise<boolean> {
        let trainer = await trainerModel.findById(id);
        if (trainer) {
            await trainerModel.findByIdAndUpdate(id, { $set: { isVerified: false } })
            return true
        }
        return false
    }
    async verifyCourse(id: string): Promise<Boolean> {
        let course = await courseModel.findById(id);
        if (course) {
            await courseModel.findByIdAndUpdate(id, { $set: { adminVerified:true } })
            return true
        }
        return false

        
    }
    async unverifyCourse(id: string): Promise<Boolean> {
        let course = await courseModel.findById(id);
        if (course) {
            const vertfy = await courseModel.findByIdAndUpdate(id, { $set: { adminVerified: false } })
            console.log(vertfy)
            return true
        }
        return false


    }
    async unblockUser(id: string): Promise<boolean> {
        let user = await userModel.findById(id);
        if (user) {
            await userModel.findByIdAndUpdate(id, { $set: { isBlocked: false } })
            return true
        }
        return false
    }
    async saveCategory(name: string, description: string): Promise<any> {
        try {
            const categoryexists = await categoryModel.findOne({ name });
            if (categoryexists) {
                return { duplicate: true, success: true }
            }
            const newcategory = new categoryModel({ name, description ,isHidden:false})
            await newcategory.save()
            return { duplicate: false, success: true }
        } catch (error) {
            console.log(error)
            return { duplicate: false, success: false }
        }

    }
    async findCategories(): Promise<Category[]> {
        const categories: (Category & { _id: ObjectId })[] = await categoryModel.find({ isHidden: false })
        const findCategory: Category[] = categories.map((category) => ({
            id: category._id,
            name: category.name,
            description: category.description,
            isHidden: category.isHidden,
            nooOfcourses:category.nooOfcourses,
            status:category.status
        }));


        return findCategory;

    }
    async findCategorybyid(id: string){
        try {
            const categoryData = await categoryModel.findById(id)
            console.log('categoryData', categoryData)
            if (categoryData) {
                return categoryData
            } else {
                return null
            }
        } catch (error) {
            console.log('category eror', error);
            return null
        }

        
    }
    async deleteCategory(id: string): Promise<boolean> {
        try {
            let category = await categoryModel.findById(id);
            if (category) {
                await categoryModel.findByIdAndUpdate(id, { $set: { isHidden: true } });
                return true; 
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false; 
        }
    }
    async editCategory(id: string, name: string, description: string): Promise<boolean> {
        try {
            const existingCategory = await categoryModel.findById(id);

            if (!existingCategory) {
                
                return false;
            }
            const categoryWithSameName = await categoryModel.findOne({ name, _id: { $ne: id } });

            if (categoryWithSameName) {
                
                return false;
            }

           
            existingCategory.name = name;
            existingCategory.description = description;

            await existingCategory.save();

            return true; 
        } catch (error) {
            console.log(error);
            return false;
        }
    }


}
export default adminRepository 

import mongoose, { ObjectId } from "mongoose";
import Category from "../../domain_entities/category";
import IcourseRepository from "../../useCase/interface/IcourseRepository";
import { courseModel } from "../database/courseModel";
import {trainerModel} from "../database/trainerModel"
import { categoryModel } from "../database/categoryModel";
import chapterModel from "../database/chapterModel";
import Course from "../../domain_entities/course";
import Chapter from "../../domain_entities/chapters";
import { Types } from 'mongoose';
import Trainer from "../../domain_entities/trainer";
import Question from "../../domain_entities/question";
import { questionModel } from "../database/questionModel";
import { enrolledStudentsModel } from "../database/enrolledStudentsModel";
import { userModel } from "../database/userModel";
import { orderModel } from "../database/orderModel";




class courseRepository implements IcourseRepository {
    async findCategories(): Promise<Category[]> {
        const categories: (Category & { _id: ObjectId })[] = await categoryModel.find({ isHidden: false })
        const findCategory: Category[] = categories.map((category) => ({
            id: category._id,
            name: category.name,
            description: category.description,
            isHidden: category.isHidden,
            nooOfcourses: category.nooOfcourses,
            status: category.status
        }));

        return findCategory;

    }
    async findCourses(): Promise<Course[]> {
        const course: (Course & { _id: ObjectId })[] = await courseModel.find({ isDeleted: false, adminVerified: true, publish: true })
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
            isDeleted:course.isDeleted,
            reviews:course.reviews,
            questions:course.questions,
            createdAt:course.createdAt,

        }));


        return findCourse

    }
    async findCoursestutor(id:string): Promise<Course[]> {
        const course: (Course & { _id: ObjectId })[] = await courseModel.find({ instructorId:id })
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
            isDeleted: course.isDeleted,
            reviews: course.reviews,
            questions: course.questions,
            createdAt: course.createdAt,

        }));


        return findCourse

    }
    async courseAdd(formData: string): Promise<any> {
        try {
            const course = await courseModel.create(formData)
            return course
        } catch (error) {
            console.log('save user error in courseRepository:', error);
            return null

        }
    }
    async courseContentAdd(CourseContentData: string): Promise<any> {
        try {
            const chapter = new chapterModel({
                chapters: CourseContentData,
            });
            await chapter.save();
            return chapter;
        } catch (error) {
            console.log('save user error in courseRepository:', error);
            return null

        }

    }
    async courseEdit(id: string, formData: any): Promise<any> {
        try {
            const course = await courseModel.updateOne({ _id: id }, formData);
            return course
        } catch (error) {
            console.log('edit course error in courseRepository:', error);
            return null

        }
    }
    async courseContentEdit(courseId: string, CourseContentData: any): Promise<any> {
        try {
            const chapter = await chapterModel.findById(courseId);
            if (!chapter) {
                throw new Error('Chapter not found');
            }
            chapter.chapters = CourseContentData;
            await chapter.save();
            return chapter;

        } catch (error) {
            console.log('save user error in courseRepository:', error);
            return null

        }

    }
    async publishById(id: string): Promise<any> {
        try {
            const updatedCourseContent = await courseModel.findByIdAndUpdate(id, { publish: true });
            return updatedCourseContent
        } catch (error) {
            console.log('save user error in courseRepository:', error);
            return null

        }


    }
    async getChapterbyId(id: string): Promise<Chapter[] | null> {
        let chapters = await chapterModel
            .find({ course: id })
            .populate("lessons").populate({ path: 'course', populate: { path: 'category' } })
            .sort("order");
        if (chapters) {
            return chapters;
        } else {
            return null;
        }
    }
    async ChapterAdd(title: string, order: string, id: string): Promise<any> {
        try {
            const course = await chapterModel.create({ title: title, course: id, order: order })
            return course
        } catch (error) {
            console.log('save user error in courseRepository:', error);
            return null

        }
    }
    async findEditCoursebyId(id: string): Promise<any> {
        try {
            const courseDetails = await courseModel.findById(id);

            return courseDetails;
        } catch (error) {
            console.log(error)
        }

    }
    async deleteById(id: string): Promise<any> {
        try {

            const course = await courseModel.findByIdAndUpdate(id, { isDeleted: true });

            if (!course) {
                throw new Error('Course not found');
            }

            return course
        } catch (error) {

            console.error('Error finding chapters for edit:', error);
            throw error;
        }



    }
    async findChaptersForEdit(id: string): Promise<any> {
        try {

            const course = await courseModel.findById(id).exec();


            if (!course) {
                throw new Error('Course not found');
            }


            const chapterIds = course.chapters;
            console.log("chaptrerids",chapterIds)
            const chapters = await chapterModel.find({ _id: { $in: chapterIds } }).exec();
            console.log("chapters",chapters)

            return chapters;
        } catch (error) {

            console.error('Error finding chapters for edit:', error);
            throw error;
        }

    }
    async reviewAdd(id: string, courseId: string, reviews: string, rating: number): Promise<any> {
        try{
            const course = await courseModel.findById(courseId)

            const data = {
                userId: id,
                comments: reviews,
                rating: rating
            };
            const updated=await courseModel.updateOne(
                { _id: courseId },
                { $push: { reviews: data } }
            );

            console.log("Reviews updated successfully.");
            return updated
      
            

        }catch(error){
            console.log(error)
        }

        
    }
    async reviewEdit(id: string, courseId: string, reviews: string, rating: number): Promise<any> {
        try {
           
            const course = await courseModel.findById(courseId);

            if (!course) {
                throw new Error('Course not found');
            }
            const userId = new mongoose.Types.ObjectId(id)
            const courseid = new mongoose.Types.ObjectId(courseId)
            const updatedCourse = await courseModel.updateOne(              
                { _id: courseid, 'reviews.userId': userId }, 
                { $set: { 'reviews.$.comments': reviews, 'reviews.$.rating': rating } }
            );
            console.log("updated",updatedCourse)

            if (!updatedCourse) {
                throw new Error('Failed to update course with review');
            }

            console.log("Reviews updated successfully.");
            return { success: true, message: 'Reviews updated successfully.' };
        } catch (error) {
            console.error('Error in reviewEdit:', error);
        }


    }
   async reviewFetch(id: string): Promise<any> {
    try{
       
        const course = await courseModel.findById(id).populate('reviews.userId');

        return course;
    } catch(error) {
        console.log(error)
    }
   }
  async AddReply(reviewId: string, replyText: string): Promise<any> {
    try{
        const updatedReview = await courseModel.findOneAndUpdate(
            { 'reviews._id': reviewId },
            { $push: { 'reviews.$.commentreplies': replyText } },
            { new: true }
        );

        return updatedReview;

    }catch(error){
        console.log(error)
    }
       
   }
    async QuestionAdd(
        question: string,
        options: string[],
        correctOption: number,
        courseId: string
    ): Promise<Question> {
        const questions: Question = await questionModel.create({
            question,
            options,
            correctOption,
            courseId,
        });

        await courseModel.findOneAndUpdate(
            { _id: courseId },
            {
                $push: {
                    questions: questions._id,
                },
            },
            {
                upsert: true,
            }
        );
        return questions;
    }
    async Getquestions(courseId: string): Promise<Question[] | null> {
        try {
            const questions = await questionModel.find({ courseId: courseId });
            if (questions) {
                return questions;
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }
    async QuestionAnswer(
        questionId: string,
        answer: number,
        courseId: string,
        studentId: string
    ): Promise<boolean> {
        try {
            const correctAnswer = await questionModel.findOne({
                _id: questionId,
                correctOption: { $eq: answer },
            });
            if (correctAnswer) {
                await enrolledStudentsModel.findOneAndUpdate(
                    { courseId: courseId, studentId },
                    { $push: { attendedQuestions: questionId } },
                    {
                        upsert: true,
                    }
                );

                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }


async CourseDataforAnalysis(){
    try {
        const last12Months: any[] = [];
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);

        for (let i = 11; i >= 0; i--) {
            const endDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - i * 28
            );
            const startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - 28
            );

            const monthYear = endDate.toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });

            const count = await courseModel.countDocuments({
                createdAt: { $gte: startDate, $lt: endDate },
            });
            last12Months.push({ month: monthYear, count });
        }
        return last12Months;
    } catch (error) {
        console.log(error);
        return null;
    }

}
async getTotalCounts() {
    try {
        const [coursesResult, usersResult, tutorsResult, salesResult] = await Promise.all([
            courseModel.aggregate([{ $count: "totalCourses" }]),
            userModel.aggregate([{ $count: "totalUsers" }]),
            trainerModel.aggregate([{ $count: "totalTutors" }]),
            orderModel.aggregate([{ $count: "totalSales" }])
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
    } catch (error) {
        console.error('Error counting documents:', error);
        throw error;
    }
}
    async getTotalCountsTutor(instructorId:string) {
        try {
            const courses = await courseModel.find({ instructorId })
            const courseIds = courses.map((course) => course._id);

            const coursesResult = await courseModel.countDocuments({ instructorId });

            const usersResult = await userModel.countDocuments({
                courseIds: { $in: courseIds }
            });

            const tutorsResult = await trainerModel.countDocuments({ _id: instructorId });

            const salesResult = await orderModel.countDocuments({ courseId: { $in: courseIds } });

            const totalAmountResult = await orderModel.aggregate([
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
        } catch (error) {
            console.error('Error counting documents:', error);
            throw error;
        }
    }

    async findEnrolledCourses(id: string,usersId:string): Promise<any> {
        try {
            const enrolledCourses = await enrolledStudentsModel.find({ studentId: usersId,courseId:id })
            return enrolledCourses;
        } catch (error) {
            console.error('Error finding enrolled courses:', error);
            throw error;
        }

    }
    async UserDataforAnalysis(): Promise<boolean | any | null> {
        try {
            const last12Months: any[] = [];
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            for (let i = 11; i >= 0; i--) {
                const endDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - i * 28
                );
                const startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - 28
                );

                const monthYear = endDate.toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const count = await userModel.countDocuments({
                    createdAt: { $gte: startDate, $lt: endDate },
                });
                last12Months.push({ month: monthYear, count });
            }
            return last12Months;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async OrderDataforAnalysis(): Promise<any> {
        try {
            const last12Months: any[] = [];
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            for (let i = 11; i >= 0; i--) {
                const endDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - i * 28
                );
                const startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - 28
                );

                const monthYear = endDate.toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const count = await orderModel.countDocuments({
                    createdAt: { $gte: startDate, $lt: endDate },
                });
                last12Months.push({ month: monthYear, count });
            }
            return last12Months;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async CourseDataAnalysisTutor(id: string): Promise<any> {
        try {
            const last12Months: any[] = [];
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            for (let i = 11; i >= 0; i--) {
                const endDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - i * 28
                );
                const startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - 28
                );

                const monthYear = endDate.toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const count = await courseModel.countDocuments({
                    createdAt: { $gte: startDate, $lt: endDate },
                    instructorId: id,
                });
                last12Months.push({ month: monthYear, count });

            }
            return last12Months;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async OrderDataAnalysisForTutor(tutorId: string): Promise<any> {
        try {
            const last12Months: any[] = [];
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            for (let i = 11; i >= 0; i--) {
                const endDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - i * 28
                );
                const startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - 28
                );

                const monthYear = endDate.toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const courses = await courseModel.find({ instructorId: tutorId });
                const courseIds = courses.map((course) => course._id);

                const count = await orderModel.countDocuments({
                    createdAt: { $gte: startDate, $lt: endDate },
                    courseId: { $in: courseIds },
                });
                last12Months.push({ month: monthYear, count });
            }
            return last12Months;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async UserDataAnalysisForTutor(tutorId: string): Promise<boolean | any | null> {
        try {
            const last12Months: any[] = [];
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            for (let i = 11; i >= 0; i--) {
                const endDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - i * 28
                );
                const startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - 28
                );

                const monthYear = endDate.toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });

                const courses = await courseModel.find({
                    instructorId: tutorId,
                });
                const courseIds = courses.map((course) => course._id);

                const count = await userModel.countDocuments({
                    createdAt: { $gte: startDate, $lt: endDate }, courseIds: { $in: courseIds }
                });
                last12Months.push({ month: monthYear, count });
                console.log(last12Months);
            }
            return last12Months;
        } catch (error) {
            console.log(error);
            return null;
        }
    }


        
    
    
    async SearchCourses(search?: string, category?: string | null, price?: string | null): Promise<any> {
        try {
            let query: any = { isDeleted: false, adminVerified: true, publish: true }

            if (category) {
                query.category = category;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: new RegExp(search, "i") } },
                    { description: { $regex: new RegExp(search, "i") } }
                ];
            }

            const sortOptions: any = {};
            if (price !== "") {
                sortOptions.price = price === "desc" ? -1 : 1;
            }
            const matchingCourses = await courseModel
                .find(query)
                .sort(sortOptions)
            console.log("matching courses",matchingCourses)
            return matchingCourses;
        } catch (error) {
            console.error('Error searching courses:', error);
            throw error;
        }
    }

   



}
export default courseRepository
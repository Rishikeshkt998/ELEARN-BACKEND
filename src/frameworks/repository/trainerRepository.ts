
import { ObjectId } from "mongoose";
import Course from "../../domain_entities/course";
import Trainer from "../../domain_entities/trainer";
import User from "../../domain_entities/user";
import ItrainerRepository from "../../useCase/interface/ItrainerRepository";
import { courseModel } from "../database/courseModel";
import { enrolledStudentsModel } from "../database/enrolledStudentsModel";

import { trainerModel } from "../database/trainerModel";
import { userModel } from "../database/userModel";



class trainerRepository implements ItrainerRepository {
    async findTrainerByEmail(email: string): Promise<Trainer | null> {
        try {
            const trainerData = await trainerModel.findOne({ email: email })
            console.log('trainerData', trainerData)
            if (trainerData) {
                return trainerData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findByEmailTutor(email: string) {
        try {
            const trainerData = await trainerModel.findOne({ email: email })
            console.log('userData', trainerData)
            if (trainerData) {
                return trainerData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findTutorById(tutorId: string) {
        try {
            console.log(tutorId)
            const tutorData = await trainerModel.findById(tutorId)
            console.log('userData', tutorData)
            if (tutorData) {
                return tutorData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async verifyTutor(tutorId: string): Promise<any> {
        try {
            const update = await trainerModel.updateOne({ _id: tutorId }, {
                $set: {
                    isVerifiedUser: true
                }
            })
            return update

        } catch (error) {
            console.log(error)
            return null
        }


    }
    async updateTrainerOtp(email: string, otp: string): Promise<any> {
        try {
            await trainerModel.updateOne({ email: email }, {
                $set: {
                    otp: otp
                }
            })

        } catch (error) {

        }

    }

    async saveTrainer(trainer: Trainer): Promise<Trainer | null> {
        try {
            const signupTrainer = await trainerModel.create(trainer)
            return signupTrainer
        } catch (error) {
            console.log('save trainer error in trainerRepository:', error);
            return null

        }
    }
    async updateTutor(email: string, otp: string): Promise<any> {
        try {
            const update = await trainerModel.updateOne({ email }, {
                $set: {
                    otp: otp
                }
            })
            return update

        } catch (error) {
            console.log(error)
        }

    }
    async savehashPasssword(email: string, hashpassword: string): Promise<any> {
        try {
            const saveHash = await trainerModel.updateOne({ email }, { $set: { password: hashpassword } })
            return saveHash

        } catch (error) {
            console.log(error)
        }

    }
    async findTrainerProfile(id: string): Promise<any> {
        try {
            let trainerData: Trainer | null = await trainerModel.findById(id)
            return trainerData

        } catch (error) {
            console.error(error)
        }

    }
    async TrainerProfileEdit(id: string): Promise<any> {
        try {
            let trainerData: Trainer | null = await trainerModel.findById(id)
            return trainerData

        } catch (error) {
            console.error(error)
        }

    }

    async updateTrainerProfile(id: string, trainer: Trainer): Promise<any> {
        try {
            let updatedTrainer = await trainerModel.updateOne({ _id: id }, trainer, { new: true })
            return updatedTrainer.acknowledged
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async Trainersaveimage(id: string, image: string): Promise<any> {
        try {
            const updatedTrainer = await trainerModel.findByIdAndUpdate(id, { image: image }, { new: true });

            if (updatedTrainer) {
                return updatedTrainer
            } else {
                console.error("User not found");
                return { success: false, message: "User not found" };
            }
        } catch (error) {
            console.error("Error saving image to database:", error);
            return { success: false, message: "Internal server error" };
        }


    }
    async savehashPasswordbyId(id: string, hashpassword: string): Promise<any> {
        try {
            const saveHash = await trainerModel.updateOne({ _id: id }, { $set: { password: hashpassword } })
            return saveHash

        } catch (error) {
            console.log(error)
        }

    }
    async findTrainerById(id: string) {
        try {
            console.log(id)
            const trainerData = await trainerModel.findById(id)
            console.log('trainerData', trainerData)
            if (trainerData) {
                return trainerData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findEnrolledStudents() {
        try {

            const enrolledStudents = await enrolledStudentsModel.find();
            const enrolledStudentsDetails: { user: User | null; course: Course | null; }[] = [];
            for (const enrolledStudent of enrolledStudents) {
                const user = await userModel.findById(enrolledStudent.studentId);
                const course = await courseModel.findById(enrolledStudent.courseId);
                enrolledStudentsDetails.push({ user, course });
            } 
            return {enrolledStudentsDetails,enrolledStudents};
        } catch (error) {
            console.log(error);
            throw error;
        }



    }
    async Shedulemeeting(id:string,meetingDate: string, meetingTime: string, meetingCode: string, description: string): Promise<any> {
        try {
        const course = await courseModel.findById(id);
        if (!course) {
            throw new Error('Course not found');
        }
        course.meeting = {
            meetingDate,
            meetingTime,
            meetingCode,
            description
        };
        await course.save();
        return course;
        } catch (error) {
            console.log(error);
            throw error;
        }

        
    }
    async findCoursesTutor(): Promise<Course[]> {
        const course: (Course & { _id: ObjectId })[] = await courseModel.find({ meeting: { $exists: true }, isDeleted: false, adminVerified:true })
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
            meeting:course.meeting,
            reviews:course.reviews

        }));


        return findCourse

    }


}
export default trainerRepository 
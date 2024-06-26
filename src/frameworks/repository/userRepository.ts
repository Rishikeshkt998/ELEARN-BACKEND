import Course from "../../domain_entities/course";
import User from "../../domain_entities/user";
import IuserRepository from "../../useCase/interface/IuserRepository";
import { conversationModel } from "../database/conversationModel";
import { courseModel } from "../database/courseModel";
import { enrolledStudentsModel } from "../database/enrolledStudentsModel";
import { favouriteModel } from "../database/favouriteModel";
import { orderModel } from "../database/orderModel";
import { userModel } from "../database/userModel";
import mongoose, { ObjectId, Types } from "mongoose";



class userRepository implements IuserRepository {

    async findByEmail(email: string) {
        try {
            const userData = await userModel.findOne({ email: email })
            if (userData) {
                return userData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findById(userId: string) {
        try {
            const id = new mongoose.Types.ObjectId(userId);
            const userData = await userModel.findById(id)
            if (userData) {
                return userData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

    }
    async findEmailById(id: string): Promise<any> {

        try {

            const userData = await userModel.findById(id).select('email');

            if (userData && userData.email) {
                return userData.email;
            } else {
                return null;
            }
        } catch (error) {
            console.log('findEmailById error', error);
            return null;
        }

    }
    async saveUser(user: User) {
        try {
            const signupUser = await userModel.create(user)
            return signupUser
        } catch (error) {
            console.log('save user error in userRepository:', error);
            return null

        }
    }
    async verifyUser(userId: string): Promise<any> {
        try {
            const update = await userModel.updateOne({ _id: userId }, {
                $set: {
                    isVerified: true
                }
            })
            return update

        } catch (error) {
            console.log(error)
            return null
        }


    }
    async updateOtp(email: string, otp: string): Promise<any> {
        try {
            await userModel.updateOne({ email: email }, {
                $set: {
                    otp: otp
                }
            })

        } catch (error) {

        }

    }
    async verifyGoogleUser(email: string): Promise<any> {
        try {
            const update = await userModel.findOneAndUpdate({ email: email }, {
                $set: {
                    isVerified: true
                }
            })
            return update

        } catch (error) {
            console.log(error)
            return null
        }


    }
    async updateUser(email: string, otp: string): Promise<any> {
        try {
            const update = await userModel.updateOne({ email }, {
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
            const saveHash = await userModel.updateOne({ email }, { $set: { password: hashpassword } })
            return saveHash

        } catch (error) {
            console.log(error)
        }

    }
    async savehashPassswordbyId(id: string, hashpassword: string): Promise<any> {
        try {
            const saveHash = await userModel.updateOne({ _id: id }, { $set: { password: hashpassword } })
            return saveHash

        } catch (error) {
            console.log(error)
        }

    }
    async findProfile(id: string): Promise<any> {
        try {
            let userData: User | null = await userModel.findById(id)
            return userData

        } catch (error) {
            console.error(error)
        }

    }
    async ProfileEdit(id: string): Promise<any> {
        try {
            let userData: User | null = await userModel.findById(id)
            return userData

        } catch (error) {
            console.error(error)
        }

    }

    async updateUserProfile(id: string, user: User): Promise<any> {
        try {
            let updatedBuyer = await userModel.updateOne({ _id: id }, user, { new: true })
            return updatedBuyer.acknowledged
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async saveimage(id: string, image: string): Promise<any> {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(id, { profileimage: image }, { new: true });

            if (updatedUser) {
                return updatedUser;
            } else {
                console.error("User not found");
                return { success: false, message: "User not found" };
            }
        } catch (error) {
            console.error("Error saving image to database:", error);
            return { success: false, message: "Internal server error" };
        }


    }
    async updateEmail(id: string, email: string, otp: string): Promise<any> {
        try {

            let updatedUser = await userModel.updateOne({ _id: id }, { email, otp });

            return updatedUser.acknowledged;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findCourseDeatailsbyId(id: string): Promise<any> {
        try {
            const courseDetails = await courseModel.findById(id).populate('reviews.userId').populate('questions').exec();

            return courseDetails;
        } catch (error) {
            console.log(error)
        }

    }
    async findCourseForAccess(id: string): Promise<any> {
        try {
            const courseDetails = await courseModel.findById(id).populate('reviews.userId').populate('questions').exec();

            return courseDetails;
        } catch (error) {
            console.log(error)
        }

    }
    async updateOrder( id: string, courseId: string, payment_Info: any): Promise<any> {
        try {
            const savedOrder = await orderModel.create({ userId: id, courseId,payment_info:payment_Info });
            
            
            return savedOrder

            

           
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async updateStudentsCourse(id: string, courseId: string): Promise<any> {
        try {
           
                const objectId = new mongoose.Types.ObjectId(id);
                const updateUser = await userModel.findByIdAndUpdate(
                    objectId,
                    { $addToSet: { courseIds: courseId.toString() } },
                    { new: true }
                );
                return  updateUser 

            


        } catch (error) {
            console.log(error);
            throw error;
        }
        
    }
    async updateChats(userId: string, courseId: string): Promise<any> {
        try {
            const course = await courseModel.findById(courseId);
            if (!course) {
                return { success: false, message: "course not found" };
            }
            const instructorId = course.instructorId;
            console.log("instructor",instructorId)
            const conversationExist = await conversationModel.findOne({
                members: { $all: [userId, instructorId] }
            });

            if (conversationExist) {
                return { success: true, conversationExist };
            }
            const newConversation = new conversationModel({ members: [userId, instructorId] });
            return await newConversation.save();
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
    async updateWhishlist(userId: string, courseId: string): Promise<any> {
        try {
            const result = await favouriteModel.findOneAndUpdate(
                { studentId: userId },
                { $pull: { favourites: courseId } }
            );

            if (!result) {
                return { success: false, message: "course not found" };
            }

            return { success: true ,result};;
            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async addEnrolled(id: string, courseId: string): Promise<any> {
        try {
            const newenrolled = new enrolledStudentsModel({
                courseId: courseId,
                studentId: id
            });

            const savedenrolled = await newenrolled.save();

            return savedenrolled;

        } catch (error) {
            console.log(error)
        }

    }
    async isEnrolled(id: string, courseId: string): Promise<any> {
        try {
            const result = await enrolledStudentsModel.findOne({ studentId: id, courseId: courseId });
            return result;
        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }


    }

    async CompletedLessonView(id: string,userId:string): Promise<any> {
        try {
            const isLesson = await enrolledStudentsModel.findOne({ courseId: id, studentId:userId });

            if (!isLesson) {
                return;
            }

            const completedLessons = isLesson.completedLessons;
            return completedLessons;

        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }

    }
    async CompletedChapterView(id: string,userId:string): Promise<any> {
        try {
            const isChapter = await enrolledStudentsModel.findOne({ courseId: id, studentId: userId });

            if (!isChapter) {
                console.log("no course");
                return;
            }

            const completedChapters = isChapter.completedChapters;
            return completedChapters;

        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }

    }
    async CompletedLesson(id: string, lessonId: any,userId:string): Promise<any> {
        try {
            const lessonObjectId = new Types.ObjectId(lessonId);
            const result = await enrolledStudentsModel.findOneAndUpdate(
                { courseId: id, studentId: userId },
                { $addToSet: { completedLessons: lessonObjectId } },
                { new: true }
            );
            return result;

        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }

    }
    async CompletedChapter(id: string, chapterId: any,userId:string): Promise<any> {
        try {
            const chapterObjectId = new Types.ObjectId(chapterId);
            const result = await enrolledStudentsModel.findOneAndUpdate(
                { courseId: id, studentId: userId },
                { $addToSet: { completedChapters: chapterObjectId } },
                { new: true }
            );
            return result;

        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }

    }
    async CompletedChapterTime(id: string, userId: string): Promise<any> {
        try {
            const result = await enrolledStudentsModel.findOneAndUpdate(
                { courseId: id, studentId: userId },
                { $set: { completedDate: new Date(), courseStatus: true } },
                { new: true }
            );
            return result;

        } catch (error) {
            console.error('Error checking enrollment status:', error);
            return false;
        }
        
    }
    async findEnrolledCourses(id: string): Promise<any> {
        try {
            const enrolledCourses = await enrolledStudentsModel.find({ studentId: id })
                .populate('courseId')
                .exec();

            return enrolledCourses;
        } catch (error) {
            console.error('Error finding enrolled courses:', error);
            throw error;
        }

    }
    async findUser(id: string): Promise<any> {
        try {
            const objectId = new mongoose.Types.ObjectId(id);
            const userData = await userModel.findById(objectId)
            if (userData) {
                return userData
            } else {
                return null
            }
        } catch (error) {
            console.log('findbyemail eror', error);
            return null
        }

        
    }
}
export default userRepository 
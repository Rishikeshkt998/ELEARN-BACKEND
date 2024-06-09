
import Question from "../domain_entities/question";
import Cloudinary from "../frameworks/services/Cloudinary";
import IcourseRepository from "./interface/IcourseRepository";

class courseUseCase {
    private IcourseRepository: IcourseRepository
    private Cloudinary: Cloudinary

    constructor(
        IcourseRepository: IcourseRepository,
        Cloudinary: Cloudinary
    ) {
        this.IcourseRepository = IcourseRepository,
            this.Cloudinary = Cloudinary
    }
    async showCategories() {
        try {
            const category = await this.IcourseRepository.findCategories()
            if (category) {
                return category
            }
            return null

        } catch (error) {
            console.log(error)
        }
    }
    async showCourse() {
        try {
            const course = await this.IcourseRepository.findCourses()

            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }
    }
    async showCourses(id:string) {
        try {
            const course = await this.IcourseRepository.findCoursestutor(id)

            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }
    }
    async AddCourse(courseData: any) {
        try {

            console.log(courseData)
            const { courseContentData, ...mainData } = courseData;

            const courseContentResponse = await this.IcourseRepository.courseContentAdd(courseContentData);
            if (!courseContentResponse) {
                throw new Error('Failed to save courseContentData');
            }

            mainData.chapters = courseContentResponse._id


            const imageUrl = await this.Cloudinary.savetocloudinary(mainData.thumbnail);
            mainData.thumbnail = imageUrl;
            const mainDataResponse = await this.IcourseRepository.courseAdd(mainData);
            if (!mainDataResponse) {
                throw new Error('Failed to save main data');
            }
            console.log('Successfully added course data');
            return { success: true, mainDataResponse, courseContentResponse };
        } catch (error) {
            console.error('Error during course data adding:', error);
            return { success: false, message: 'Internal server error' };
        }
    }
    async EditCourseDetails(courseId: string, data: any) {
        try {
            console.log(data)
            const { courseContentData, ...mainData } = data;
            const imageUrl = await this.Cloudinary.savetocloudinary(mainData.thumbnail);
            mainData.thumbnail = imageUrl;
            const mainDataResponse = await this.IcourseRepository.courseEdit(courseId, mainData);
            if (!mainDataResponse) {
                throw new Error('Failed to save main data');
            }
            const chapter=await this.IcourseRepository.findEditCoursebyId(courseId)
            let chapterId=chapter.chapters._id
            console.log(chapter)


            const courseContentResponse = await this.IcourseRepository.courseContentEdit(chapterId, courseContentData);
            if (!courseContentResponse) {
                throw new Error('Failed to save courseContentData');
            }
            return { success: true, mainDataResponse, courseContentResponse };
        } catch (error) {
            console.error('Error during course data editing:', error);
            return { success: false, message: 'Internal server error' };
        }
    }

    async getChapters(id: string) {
        try {
            let chapters = await this.IcourseRepository.getChapterbyId(id)

            return { chapters: chapters };
        } catch (error) {
            console.log(error);
        }
    }

    async AddChapter(title: string, id: string, order: string) {
        try {



            const response = await this.IcourseRepository.ChapterAdd(title, id, order);
            if (response) {
                console.log('successsfull updated data')
            }

            return response;
        } catch (error) {
            console.error('Error during chapter data adding:', error);
            return { success: false, message: 'Internal server error' };
        }
    }

    async EditCoursePagedisplaybyId(id: string) {
        try {
            const course = await this.IcourseRepository.findEditCoursebyId(id)
            console.log(course)
            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }
    async EditDisplayChapters(id: string) {
        try {
            const chapters = await this.IcourseRepository.findChaptersForEdit(id)
            console.log(chapters)
            if (chapters) {
                return chapters
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async publishCourses(id: string) {
        try {
            let chapter = await this.IcourseRepository?.findChaptersForEdit(id);
            console.log(chapter)
            if (chapter) {
               
                    let published = await this.IcourseRepository.publishById(id);
                    console.log(published)

                    return { status: true, message: "published succesfully" ,published};
               
            } else {
                throw new Error("could not find chapter");
            }
        } catch (error) {
            throw error;
        }
    }
    async CourseDelete(id:string){
        try {
            const deleteddata = await this.IcourseRepository.deleteById(id)
            console.log(deleteddata)
            if (deleteddata) {
                return deleteddata
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    async reviewAdd(userId: string, id: string, reviews:string, rating:number) {
        try {
            const reviewresult = await this.IcourseRepository.reviewAdd(userId, id, reviews, rating)
            console.log(reviewresult)
            if (reviewresult) {
                return reviewresult
            }
            return null
        } catch (error) {
            console.log(error)
        }



    }
    async reviewEdit(userId: string, id: string, reviews: string, rating: number) {
        try {
            const reviewresult = await this.IcourseRepository.reviewEdit(userId, id, reviews, rating)
            console.log(reviewresult)
            if (reviewresult) {
                return reviewresult
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    async fetchReviews(id:string){
        try {
            const fetchreview = await this.IcourseRepository.reviewFetch(id)
            console.log(fetchreview)
            if (fetchreview) {
                return fetchreview
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    async ReplyAdd(reviewId:string, replyText: string) {
        try {
            const replyadd = await this.IcourseRepository.AddReply(reviewId, replyText)
            console.log(replyadd)
            if (replyadd) {
                return replyadd
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    
    async TotalCount() {
        try {
            const count = await this.IcourseRepository.getTotalCounts()
            console.log(count)
            if (count) {
                return count
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async TotalTutorCount(id:string) {
        try {
            const count = await this.IcourseRepository.getTotalCountsTutor(id)
            console.log(count)
            if (count) {
                return count
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisCourse() {
        try {
            const course = await this.IcourseRepository.CourseDataforAnalysis()
            console.log(course)
            if (course) {
                return course
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisOrder() {
        try {
            const order = await this.IcourseRepository.OrderDataforAnalysis()
            console.log(order)
            if (order) {
                return order
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisUser() {
        try {
            const user = await this.IcourseRepository.UserDataforAnalysis()
            console.log(user)
            if (user) {
                return user
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisCourseTutor(id:string) {
        try {
            const course = await this.IcourseRepository.CourseDataAnalysisTutor(id)
            console.log(course)
            if (course) {
                return course
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisOrderTutor(id:string) {
        try {
            const order = await this.IcourseRepository.OrderDataAnalysisForTutor(id)
            console.log(order)
            if (order) {
                return order
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AnalysisUserTutor(id:string) {
        try {
            const user = await this.IcourseRepository.UserDataAnalysisForTutor(id)
            console.log(user)
            if (user) {
                return user
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    async AddQuestion(
        question: string,
        options: string[],
        correctOption: number,
        courseId: string
    ) {
        const questions = await this.IcourseRepository.QuestionAdd(
            question,
            options,
            correctOption,
            courseId
        );
        return { status: true, questions };
    }

    async QuestionGet(courseId: string) {
        try {
            const questions: Question[] | null = await this.IcourseRepository.Getquestions(courseId);
            if (questions) {
                return { status: true, questions };
            } else {
                return { status: false };
            }
        } catch (error) {
            console.log(error);
        }
    }

    async AnswerQuestion(questionId: string, answer: number, courseId: string, studentId: string) {
        try {
            const response = await this.IcourseRepository.QuestionAnswer(questionId, answer, courseId, studentId);
            if (response) {
                return { status: true, message: 'yayy!!!' }
            } else {
                return { status: false, message: "oops wrong answer" }
            }
        } catch (error) {
            console.log(error);

        }
    }
    async getEnrolledCourse(id: string,usersId:string) {
        try {
            const EnrolledCourses = await this.IcourseRepository.findEnrolledCourses(id,usersId)
            if (EnrolledCourses) {
                return EnrolledCourses
            }
            return null
        } catch (error) {
            console.log(error)
        }

    }
    
    async SearchCourses(search: string,category:string,price:string) {
        try {
            const searchresult = await this.IcourseRepository.SearchCourses(search,category,price)
            console.log(searchresult)
            if (searchresult) {
                return searchresult
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }





}
export default courseUseCase
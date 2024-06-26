import { Request, Response } from "express";
import courseUseCase from "../useCase/CourseUseCase";
import Multer from "multer"
import { generateCertificate } from "../frameworks/services/pdfKit";

class courseController {
    private courseCase: courseUseCase
    constructor(courseCase: courseUseCase) {
        this.courseCase = courseCase
    }

    async Categoryshow(req: Request, res: Response) {
        try {
            const category = await this.courseCase.showCategories()
            if (category) {
                return res.status(200).json(category)
            } else {
                return res.status(401).json({ success: false, message: 'category not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async Courseshow(req: Request, res: Response) {
        try {
            const course = await this.courseCase.showCourse()
            if (course) {
                return res.status(200).json(course)
            } else {
                return res.status(401).json({ success: false, message: 'course not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async CourseshowAdmin(req: Request, res: Response) {
        try {
            const course = await this.courseCase.showCourseForAdmin()
            if (course) {
                return res.status(200).json(course)
            } else {
                return res.status(401).json({ success: false, message: 'course not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async Courseshows(req: Request, res: Response) {
        try {
            const id=req.params.id
            const course = await this.courseCase.showCourses(id)
            if (course) {
                return res.status(200).json(course)
            } else {
                return res.status(401).json({ success: false, message: 'course not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async addCourse(req:Request,res:Response){
        try{
            const formData=req.body
            const Response = await this.courseCase.AddCourse(formData)
            if (Response){
                res.status(200).json({ success: true ,message:'added course data',Response})
            }else{

                res.status(200).json({ success: true, message: 'error in adding couse data' })
            }

        }catch(error){
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async EditCourse(req: Request, res: Response) {
        try {
            const courseId=req.params.courseId
            const data = req.body
            const Response = await this.courseCase.EditCourseDetails(courseId,data)
            if (Response) {
                res.status(200).json({ success: true, message: 'Edited the course data', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in editing couse data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async DeleteCourses(req: Request, res: Response) {
        try {
            const id = req.params.id
            const Response = await this.courseCase.CourseDelete(id)
            if (Response) {
                res.status(200).json({ success: true, message: 'successfully deleted course', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in deleting  couse data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async EditDisplayCoursebyId(req: Request, res: Response) {
        try {
            
            const id = req.params.courseId
            const Response = await this.courseCase.EditCoursePagedisplaybyId(id)
            if (Response) {
                res.status(200).json({ success: true, message: 'added course data', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in adding couse data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async DisplayChapters(req: Request, res: Response) {
        try {

            const id = req.params.courseId
            const Response = await this.courseCase.EditDisplayChapters(id)
            if (Response) {
                res.status(200).json({ success: true, message: 'edited course', Response })
            } else {

                res.status(200).json({ success: true, message: 'error in editing chapters' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    
    async getChapter(req: Request, res: Response) {
        try {
            let courseId = req.query.id as string;

            let chapters = await this.courseCase.getChapters(courseId)

            res.status(200).json(chapters);
        } catch (error) {
            console.log(error);
        }
    
    }
    async publishCourse(req: Request, res: Response) {
        try {
            let  id  = req.params.id;
            let publish= await this.courseCase.publishCourses(id)
            if (publish?.status) {
                res.status(200).json(publish);
            } else {
                res.status(401).json(publish);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    async addChapter(req: Request, res: Response) {
        try {

            const {title,id,order}=req.body
            
            const Response = await this.courseCase.AddChapter(title,id,order)
            if (Response) {
                res.status(200).json({ success: true, message: 'added chapter data' })
            } else {

                res.status(200).json({ success: true, message: 'error in adding chapter data' })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async AddReviews(req:Request,res:Response){
        try{
            const {userId, id,reviews,rating} = req.body
            const addreviews = await this.courseCase.reviewAdd(userId, id, reviews, rating)
            if (addreviews) {
                res.status(200).json({ success: true, addreviews });

            } else {
                res.status(200).json({ success: false });
            }


        }catch(error){
            console.log(error)
        }

    }
    async EditReviews(req: Request, res: Response) {
        try {
            const { userId, id, reviews, rating } = req.body
            const editreviews = await this.courseCase.reviewEdit(userId, id, reviews, rating)
            if (editreviews) {
                res.status(200).json({ success: true, editreviews });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }

    }
    async getReviews(req: Request, res: Response) {
        try {
            const id = req.params.id
            const fetchreviews = await this.courseCase.fetchReviews(id)
            if (fetchreviews) {
                res.status(200).json({ success: true, fetchreviews });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }

    }
    async addReply(req: Request, res: Response) {
        try {
            const {reviewId,replyText}= req.body
            const reviewreply = await this.courseCase.ReplyAdd(reviewId,replyText)
            if (reviewreply) {
                res.status(200).json({ success: true, reviewreply });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }

    }
    async TotalCount(req: Request, res: Response) {
        try {

            const count = await this.courseCase.TotalCount()
            if (count) {
                res.status(200).json({ success: true, count });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async TotalTutorCount(req: Request, res: Response) {
        try {
            const id = req.params.id
            const count = await this.courseCase.TotalTutorCount(id)
            if (count) {
                res.status(200).json({ success: true, count });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async courseAnalysis(req: Request, res: Response) {
        try {
            
            const course = await this.courseCase.AnalysisCourse()
            if (course) {
                res.status(200).json({ success: true, course });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async userAnalysis(req: Request, res: Response) {
        try {

            const user = await this.courseCase.AnalysisUser()
            if (user) {
                res.status(200).json({ success: true, user });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async orderAnalysis(req: Request, res: Response) {
        try {
            
            const order = await this.courseCase.AnalysisOrder()
            if (order) {
                res.status(200).json({ success: true, order });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async courseAnalysisForTutor(req: Request, res: Response) {
        try {

            const id=req.params.id
            const course = await this.courseCase.AnalysisCourseTutor(id)
            if (course) {
                res.status(200).json({ success: true, course });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async userAnalysisForTutor(req: Request, res: Response) {
        try {
            const id = req.params.id
            const user = await this.courseCase.AnalysisUserTutor(id)
            if (user) {
                res.status(200).json({ success: true, user });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async orderAnalysisForTutor(req: Request, res: Response) {
        try {
            const id = req.params.id
            const order = await this.courseCase.AnalysisOrderTutor(id)
            if (order) {
                res.status(200).json({ success: true, order });

            } else {
                res.status(200).json({ success: false });
            }


        } catch (error) {
            console.log(error)
        }
    }
    async QuestionAdd(req: Request, res: Response) {
        try {
            const { question, options, correctOption, courseId } = req.body;
            const response = await this.courseCase.AddQuestion(
                question,
                options,
                correctOption,
                courseId
            );
            if (response.status) {
                res.status(200).json(response);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async GetQuestion(req: Request, res: Response) {
        try {
            const courseId = req.params.id as string;

            const response = await this.courseCase.QuestionGet(courseId);
            if (response?.status) {
                res.status(200).json(response);
            } else {
                res.status(200).json(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async QuestionAnswer(req: Request, res: Response) {
        try {
            const questionId = req.body.questionId;


            const answer = req.body.answer;
            const courseId = req.body.id;
            const studentId = req.body.usersId
            const response = await this.courseCase.AnswerQuestion(questionId, answer, courseId, studentId);
            if (response?.status) {
                res.status(200).json(response)
            } else {
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error);

        }
    }
    async removeQuestion(req: Request, res: Response) {
        try {
            
            const courseId = req.query.courseId as string;
            const questionId = req.query.questionId as string ;
            console.log("values",courseId, questionId)
            const response = await this.courseCase.removeQuestion(
                questionId,
                courseId
            );
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
        }
    }
    async GetEnrolled(req: Request, res: Response) {
        try {
            const id = req.params.id
            const usersId=req.params.usersId
            const EnrolledCourses = await this.courseCase.getEnrolledCourse(id,usersId)
            if (EnrolledCourses) {
                return res.status(200).json({ success: true, EnrolledCourses })
            } else {
                return res.status(401).json({ success: false, message: 'enrolled students  not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async GetEnrolledForPurchase(req: Request, res: Response) {
        try {
            const usersId = req.params.usersId
            const EnrolledCourses = await this.courseCase.getEnrolledCourseForPurchase(usersId)
            if (EnrolledCourses) {
                return res.status(200).json({ success: true, EnrolledCourses })
            } else {
                return res.status(401).json({ success: false, message: 'enrolled students  not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async generateCertificate(req: Request, res: Response) {
        try {
            
            const courseId = req.params.courseId;
            const studentId = req.params.studentId;
            console.log("courseId,", courseId, studentId)
            const isCourseCompleted =await this.courseCase.isCourseCompleted(courseId,studentId);
            console.log("iscourse",isCourseCompleted)
            if (isCourseCompleted) {
                await generateCertificate(
                    res,
                    isCourseCompleted.response?.studentId.name as string,
                    isCourseCompleted.response?.courseId.name as string,
                    isCourseCompleted.response?.completedDate as Date
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=certificate.pdf"
                );
                res.setHeader("Content-Type", "application/pdf");
                
                
            } else {
                res.status(401).json({ message: "course not completed" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send("An error occurred");
        }
    }


    async CourseSearch(req: Request, res: Response) {

        try {
            
            const search = req.query.searchTerm as string;
            const category = req.query.category as string;
            const price = req.query.price as string
            const result = await this.courseCase.SearchCourses(search,category,price)
            if (result) res.json({ success: true, data: result, message: 'Successfully searched course' });
            else res.json({ success: false, message: "somthing went wrong while fetching the job details!" });
            
               
            
        } catch (error) {
            console.log(error as Error);
            res.json({ success: false, message: 'Internal server error occured!' });
        }

    }
    async addToFavourite(req: Request, res: Response) {
        try {
            const studentId = req.body.userId;
            const courseId = req.body.courseId;
            console.log(studentId,courseId)
            const response = await this.courseCase.addToFavourite(studentId, courseId);
            if (response?.status) {
                res.status(200).json(response);
            } else {
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async fetchFavourites(req: Request, res: Response) {
        try {
            const studentId = req.query.userId as string;
            console.log(studentId, "sssss");

            const response = await this.courseCase.fetchFavourites(studentId);
            if (response?.status) {
                res.status(200).json(response)
            } else {
                res.status(200).json(response)
            }
        } catch (error) {
            console.log(error);

        }
    }



   


   

}
export default courseController
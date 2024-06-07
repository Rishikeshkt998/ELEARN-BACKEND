import { Request, Response } from "express";
import adminUseCase from "../useCase/AdminUseCase";

class adminController {
    private adminCase: adminUseCase
    constructor(adminCase: adminUseCase) {
        this.adminCase = adminCase
    }
    async SignUpAdmin(req: Request, res: Response) {
        try {
            let adminData = req.body
            const admin = await this.adminCase.AdminSignUp(adminData)
            res.json(admin)  
        } catch (error) {
            console.log('signup error : ', error);
        }
    }
    async AdminLogin(req:Request, res:Response) {
        try {
            const { email, password } = req.body;
            const adminData = await this.adminCase.LoginAdmin(email, password);
            if (adminData?.success) {
                res.cookie('adminToken', adminData.token, {
                    sameSite: "lax",
                    secure: true
                }).status(200).json( adminData )
            } else {
                return res.status(200).json(adminData)
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' })
        }
     }
    
    async user(req: Request, res: Response) {
        try {
            const findeduser = await this.adminCase.getUsers()
            if (findeduser) {
                return res.status(200).json({ success: true, findeduser })
            } else {
                return res.status(401).json({ success: false, message: 'Users not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async Courses(req: Request, res: Response) {
        try {
            const course = await this.adminCase.ViewCourses()
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
    async Trainers(req: Request, res: Response) {
        try {
            const findedtrainer = await this.adminCase.getTutors()
            if (findedtrainer) {
                return res.status(200).json({ success: true, findedtrainer })
            } else {
                return res.status(401).json({ success: false, message: 'Trainer not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async blockUser(req: Request, res: Response) {
        try {
            let userId = req.params.id
            let blocked = await this.adminCase.blockUser(userId)
            if (blocked) {
            console.log(blocked)
                res.cookie("userToken", "", {
                    httpOnly: true,
                    expires: new Date(0),
                });
                res.status(200).json({ success: true, blocked ,userId});
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async verifyTrainer(req: Request, res: Response) {
        try {
            let id = req.params.id
            console.log(id)
            let verified = await this.adminCase.trainerVerify(id)
            if (verified) {
                res.status(200).json({ success: true,message:"trianer is not verified" });
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async unVerifyTrainer(req: Request, res: Response) {
        try {
            let id = req.params.id
            let unverify = await this.adminCase.TrainerUnverify(id)
            if (unverify) {
                res.status(200).json({ success: true ,message:"trainer not verified"});
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async verifyCourse(req: Request, res: Response) {
        try {
            let id = req.params.id
            console.log(id)
            let verified = await this.adminCase.CourseVerify(id)
            if (verified) {
                res.status(200).json({ success: true, message: "course verified" });
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async unverifyCourse(req: Request, res: Response) {
        try {
            let id = req.params.id
            let unverify = await this.adminCase.CourseunVerify(id)
            if (unverify) {
                res.status(200).json({ success: true, message: "course unverify" });
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async unblockUser(req: Request, res: Response) {
        try {
            let userId = req.params.id
            let unblocked = await this.adminCase.unblockUser(userId)
            if (unblocked) {
                res.cookie("userToken", "", {
                    httpOnly: true,
                    expires: new Date(0),
                });
                res.status(200).json({ success: true });
            } else {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async categoryadd(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            let savedCategory = await this.adminCase.addCategory(name,description)
            if (savedCategory?.success) {
                if (savedCategory?.duplicate) {
                    return res.status(200).json({ success: false, message: 'Category already exists !!' })
                } else if (!savedCategory?.duplicate) {
                    return res.status(200).json({ success: true, message: 'New category added successfully' })
                }
            } else if (!savedCategory?.success) {
                res.status(200).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async showCategory(req: Request, res: Response) {
        try {
            const category = await this.adminCase.displayCategory()
            if (category) {
                return res.status(200).json(category)
            } else {
                return res.status(401).json({ success: false, message: 'Users not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async editCategoryDisplay(req: Request, res: Response) {
        try {
            const id=req.params.id
            const category = await this.adminCase.editDisplay(id)
            if (category) {
                return res.status(200).json({ success: true, category })
            } else {
                return res.status(401).json({ success: false, message: 'Users not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async deleteCategory(req: Request, res: Response) {
        try {
            const categoryid=req.params.id
            console.log(categoryid)
            const category = await this.adminCase.deleteCategory(categoryid)
            if (category) {
                return res.status(200).json({ success: true, category })
            } else {
                return res.status(401).json({ success: false, message: 'Users not found' })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async editcategory(req: Request, res: Response) {
        try {
            const categoryId = req.params.id
            const {name,description} = req.body;
            if (categoryId) {
                const updateData = await this.adminCase.editCategory(categoryId,name,description)
                if (updateData) {
                    res.status(200).json({ success: true })
                } else {
                    res.status(401).json({ success: false, message: 'Not updated!' })
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async adminLogout(req: Request, res: Response) {
        try {
            res.cookie("adminToken", "", {
                httpOnly: true,
                expires: new Date(0)
            });
            res.status(200).json({ success: true })
        } catch (error) {
            console.log(error)
        }
    }

}
export default adminController
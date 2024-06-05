import Admin from "../domain_entities/admin";
import IadminRepository from "./interface/IadminRepository";
import JwtToken from "../frameworks/services/JwtToken";
import HashPassword from "../frameworks/services/HashPassword";




class adminUseCase {
    private iAdminRepository:IadminRepository
    private JwtToken:JwtToken
    private HashPassword:HashPassword

    constructor(
        iAdminRepository:IadminRepository,
        JwtToken:JwtToken,
        HashPassword:HashPassword
    ){
        this.iAdminRepository = iAdminRepository,
        this.JwtToken=JwtToken
        this.HashPassword=HashPassword
    }
    async AdminSignUp(admin: Admin) {
        try {
            const email = admin.email;
            const isAdmin = await this.iAdminRepository.findAdminByEmail(email)
            if (isAdmin) {
                return { success: false, message: 'This Email is already exists' };
            } else {
                const hashedPassword = await this.HashPassword.Hashing(admin.password);
                admin.password = hashedPassword;


                const adminSave = await this.iAdminRepository.saveAdmin(admin)

                if (!adminSave) {
                    return { success: false, message: 'Something went wrong while saving admin data' };
                } else {
                    return { success: true, message: 'admin successfully signed up' };
                }
            }
        } catch (error) {
            console.log('User signup error in UserUseCase:', error);
            return { success: false, message: 'Internal server error' };
        }
    }

    async LoginAdmin(email:string,password:string){
        try{
            const adminData:any= await this.iAdminRepository.findAdminByEmail(email)
            if(adminData){
                const matched= await this.HashPassword.Compare(password,adminData.password)
                if(matched){
                    const token = await this.JwtToken.SignJwt(adminData._id as string,"admin")
                    // const token = await this.JwtToken.SignJwt(adminData)

                    return { success: true, adminData: adminData, token: token }
                    
                }else{
                    return { success: false, message:'password is wrong' }
                }
            }else{
                return { success: false, message: 'email is wrong' }
            }

        }catch(error){
            console.log(error)

        }

    }
    async getUsers() {
        try {
            const users = await this.iAdminRepository.findUser()
            if (users) {
                return users
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }
    
    async ViewCourses() {
        try {
            const course = await this.iAdminRepository.CourseFind()

            if (course) {
                return course
            }
            return null

        } catch (error) {
            console.log(error)
        }
    }
    async getTutors() {
        try {
            const trainer = await this.iAdminRepository.findTutor()
            if (trainer) {
                return trainer
            }
            return null
        } catch (error) {
            console.log(error)
        }
    }

    async blockUser(id: string) {
        try {
            let blocked = await this.iAdminRepository.blockUser(id)
            return blocked;
        } catch (error) {
            console.log(error)
        }
    }
    async trainerVerify(id: string) {
        try {
            let verified = await this.iAdminRepository.verifyTrainer(id)
            return verified 
        } catch (error) {
            console.log(error)
        }
    }
    async TrainerUnverify(id: string) {
        try {
            let unverified = await this.iAdminRepository.unverifyTrainer(id)
            return unverified
        } catch (error) {
            console.log(error)
        }
    }
    async CourseVerify(id: string) {
        try {
            let verifiedcourse = await this.iAdminRepository.verifyCourse(id)
            return verifiedcourse
        } catch (error) {
            console.log(error)
        }
    }
    async CourseunVerify(id: string) {
        try {
            let unverifiedcourse = await this.iAdminRepository.unverifyCourse(id)
            return unverifiedcourse
        } catch (error) {
            console.log(error)
        }
    }
    async unblockUser(id: string) {
        try {
            let unblocked = await this.iAdminRepository.unblockUser(id)
            return unblocked;
        } catch (error) {
            console.log(error)
        }
    }
    async addCategory(name:string,description:string){
        try{
            const savedcategory=await this.iAdminRepository.saveCategory(name,description)
            if(savedcategory){
                return savedcategory
            }
            return null

        }catch(error){
            console.error(error)
        }

    }
    async displayCategory(){
        try{
            const category=await this.iAdminRepository.findCategories()
            if(category){
                return category
            }
            return null

        }catch(error){
            console.log(error)
        }

    }
    async editDisplay(id:string) {
        try {
            const category = await this.iAdminRepository.findCategorybyid(id)
            console.log(category)
            if (category) {
                return category
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }
    async deleteCategory(id:string) {
        try {
            const deletedcategory = await this.iAdminRepository.deleteCategory(id)
            console.log(deletedcategory)
            if (deletedcategory) {
                return deletedcategory
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }
    async editCategory(id: string,name:string,description:string) {
        try {
            const editcategory = await this.iAdminRepository.editCategory(id,name,description)
            console.log(editcategory)
            if (editcategory) {
                return editcategory
            }
            return null

        } catch (error) {
            console.log(error)
        }

    }


}
export default adminUseCase
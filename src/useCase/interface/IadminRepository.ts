import Admin from "../../domain_entities/admin";
import Category from "../../domain_entities/category";
import Course from "../../domain_entities/course";
import Trainer from "../../domain_entities/trainer";

interface IadminRepository{
    findAdminByEmail(email: string): Promise<Admin | null>
    saveAdmin(admin:Admin): Promise<Admin | null>
    findUser():Promise<Admin[]>
    findTutor(): Promise<Trainer[]>
    blockUser(id:string):Promise<Boolean>
    unblockUser(id: string): Promise<Boolean>
    saveCategory(name: string,description:string): Promise<any>
    findCategories(): Promise<Category[]>,
    findCategorybyid(id: string): Promise<Category|null>,
    deleteCategory(id: string): Promise<boolean>,
    editCategory(id: string, name: string, description: string): Promise<boolean>,
    verifyTrainer(id: string): Promise<Boolean>
    unverifyTrainer(id: string): Promise<Boolean>
    CourseFind(): Promise<Course[]>,
    verifyCourse(id: string): Promise<Boolean>
    unverifyCourse(id: string): Promise<Boolean>



}
export default IadminRepository
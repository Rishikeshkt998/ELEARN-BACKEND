interface Category {
    _id?: string;
    name: string;
    description: string;
    isHidden?:boolean;
    nooOfcourses?:Number;
    status: "active" | "frozen";

}


export default Category
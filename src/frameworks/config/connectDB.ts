import mongoose from 'mongoose';
export const connectDB=async ()=>{
    try{
        const mongouri = process.env.MONGO_CONNECTION_STRING as string
        console.log('mongo uri:',mongouri)
        await mongoose.connect(mongouri)
        console.log('mongodb connected')
    }catch(error){
        console.log('mongodb connection error:',error)
    }
}
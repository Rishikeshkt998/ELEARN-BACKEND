import { createServer } from "./frameworks/config/app";
import dotenv from 'dotenv'

import { connectDB } from "./frameworks/config/connectDB";

dotenv.config()
const server=async()=>{
    try{
        await connectDB()
        const app=createServer()

        const PORT=process.env.PORT||5000
        app?.listen(PORT,()=>{
            console.log(`server runs on port:${PORT}`)
        })
    }catch(error){
        console.log('server error:',error)
    }
}
server()
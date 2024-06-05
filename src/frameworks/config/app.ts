import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import adminRouter from '../routes/adminRouter'
import trainerRouter from '../routes/TrainerRouter'
import userRouter from '../routes/userRoutes'
import bodyParser from 'body-parser'
import socketServer from "./Socketio";
import http from 'http'


dotenv.config()

export const createServer=()=>{
    try{
        const app=express()
        app.use(express.urlencoded({extended:true}))
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(cookieParser())
        app.use(
            cors({
                // origin: 'http://localhost:3000',
                origin: process.env.ORIGIN || "*" ,
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true
            })
        )
        app.use('/api/user',userRouter)
        app.use('/api/admin',adminRouter)
        app.use('/api/trainer', trainerRouter)
        const server = http.createServer(app)
        socketServer(server)

        return server;
    }catch(error){
        console.log('created server error:',error)
    }
}
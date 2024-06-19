import express, { Request, Response, NextFunction } from "express";
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
        const corsOptions = {
            origin: process.env.ORIGIN || "*",
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            allowedHeaders:"Origin,X-Requested-With,Content-Type,Accept,Authorization,Course-Id",
            optionsSuccessStatus: 200,
        };

        app.use('*',cors(corsOptions));

        app.use((req: Request, res: Response, next: NextFunction) => {
            res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
        
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
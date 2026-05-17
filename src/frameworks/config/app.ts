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
        
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5000",
        ];

        if (process.env.ORIGIN) {
            const origins = process.env.ORIGIN.split(",").map(o => o.trim());
            allowedOrigins.push(...origins);
        }

        const corsOptions = {
            origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
                if (!origin) return callback(null, true);
                // Clean the origin string
                const cleanOrigin = origin.replace(/\/$/, "");
                
                // Also support comparing without protocol in case they forgot https:// in their env config
                const matches = allowedOrigins.some(allowed => {
                    const cleanAllowed = allowed.trim().replace(/\/$/, "");
                    return cleanOrigin === cleanAllowed || 
                           cleanOrigin === `https://${cleanAllowed}` || 
                           cleanOrigin === `http://${cleanAllowed}`;
                });

                if (matches) {
                    callback(null, true);
                } else {
                    console.log("Blocked by CORS. Origin:", origin, "Allowed:", allowedOrigins);
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization,Course-Id",
            optionsSuccessStatus: 200,
        };

        app.use(cors(corsOptions));
        app.use(express.urlencoded({extended:true}))
        app.use(bodyParser.json({ limit: '10mb' }));
        app.use(cookieParser())
        
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



import { Request, Response, NextFunction } from 'express';
import JwtToken from '../services/JwtToken';
import dotenv from 'dotenv';
import userRepository from '../repository/userRepository';
import { TokenExpiredError } from 'jsonwebtoken';

const repository = new userRepository();
const jwt = new JwtToken();
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            courseId?: string;
        }
    }
}

const CourseAccessAuth = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(" ")[1] as string;
    console.log("token",token)
    // const courseId = req.cookies.courseId;
    const courseId = req.headers['course-id'] as string;
    console.log("courseId",courseId)
    const RefreshToken = req.cookies.refreshToken as string;


    if (!token) {
        console.log("unauthorized-1");

        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = await jwt.VerifyJwt(token);
        if (!decoded || decoded.role !== 'user') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
        if (!decoded.id) {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
        const user = await repository.findById(decoded.id);
        console.log(decoded);
        if (decoded.isBlocked) {
            return res.status(401).send({ success: false, message: 'User is blocked !!' });
        }

        const enrollment = await repository.isEnrolled(decoded.id, courseId);
        console.log("courseId,useerId", decoded.id, courseId)
        if (!enrollment) {
            return res.status(401).send({ success: false, message: 'User is not enrolled in this course' });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            if (!RefreshToken) {
                console.log("unauthorized-3");
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized - Invalid token" });
            }

            try {
                const refreshToken = await jwt.VerifyRefreshJwt(RefreshToken);
                console.log("refresh token", refreshToken?.id)

                let user = await repository.findById(refreshToken?.id)

                if (!user) {
                    console.log("unauthorized-4");
                    return res
                        .status(401)
                        .send({ success: false, message: "User not found" });
                }

                const newAccessToken = await jwt.SignJwt(refreshToken?.id, refreshToken?.role);
                res.locals.newAccessToken = newAccessToken;
                console.log("new access", res.locals.newAccessToken)

                req.userId = refreshToken?.id
                if (res.locals.newAccessToken) {
                    return res.status(200).json({ success: true, newAccessToken: res.locals.newAccessToken });
                } else {
                    return next();
                }


            } catch (refreshError) {
                console.log("unauthorized-5");
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized - Invalid token" });
            }
        }

        console.error(error);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
    }
}

export default CourseAccessAuth;
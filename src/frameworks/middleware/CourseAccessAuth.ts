


import { Request, Response, NextFunction } from 'express';
import JwtToken from '../services/JwtToken';
import dotenv from 'dotenv';
import userRepository from '../repository/userRepository';

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
    const token = req.cookies.userToken;
    const courseId = req.cookies.courseId;
    console.log(courseId);
    console.log("tokenvalue", token);
    let RefreshToken = req.cookies.refreshToken;
    if (!RefreshToken) {
        return res.json({ success: false, message: 'Token expired or not available' });
    }
    // if (!token) {
    //     const refreshToken = await jwt.VerifyRefreshJwt(RefreshToken);

    //     if (refreshToken) {
    //         const newAccessToken = await jwt.SignJwt(refreshToken.id, refreshToken.role);
    //         res.cookie('userToken', newAccessToken, {
    //             expires: new Date(Date.now() + 300000),
    //             httpOnly: true,
    //         });
    //     }
    // }
    if (!token) {
        return res.status(401).send({ success: false, message: "Unauthorized - Token not provided" });
    }
    try {
        const refreshToken = await jwt.VerifyRefreshJwt(RefreshToken);

        if (refreshToken) {
            const newAccessToken = await jwt.SignJwt(refreshToken.id, refreshToken.role);
            res.cookie('userToken', newAccessToken, {
                expires: new Date(Date.now() + 300000),
                httpOnly: true,
            });
        }
    } catch (error) {
        console.error("Error generating new access token:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
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
        console.log(enrollment);
        if (!enrollment) {
            return res.status(401).send({ success: false, message: 'User is not enrolled in this course' });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
}

export default CourseAccessAuth;
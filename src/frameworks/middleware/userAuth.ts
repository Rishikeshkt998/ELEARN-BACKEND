
import { Request, Response, NextFunction } from 'express'
import JwtToken from '../services/JwtToken';
import dotenv from 'dotenv';
import userRepository from '../repository/userRepository';
const repository = new userRepository();
const jwt = new JwtToken();
dotenv.config()

dotenv.config()

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const RefreshToken = req.headers.authorization?.split(" ")[1] as string;
    console.log("authorization", RefreshToken)
    // const refreshToken = req.headers.refreshtoken
    // console.log("refresh",refreshToken)
    let token = req.cookies.userToken;
    // let RefreshToken = req.cookies.refreshToken;
    if (!RefreshToken) {
        return res.json({ success: false, message: 'Token expired or not available' });
    }
    if (!token) {
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
    }
    // if (!token) {
    //     return res.status(401).send({ success: false, message: "Unauthorized - Token not provided" });
    // }
    // try {
    //     const refreshToken = await jwt.VerifyRefreshJwt(RefreshToken);

    //     if (refreshToken) {
    //         const newAccessToken = await jwt.SignJwt(refreshToken.id, refreshToken.role);
    //         res.cookie('userToken', newAccessToken, {
    //             expires: new Date(Date.now() + 300000),
    //             httpOnly: true,
    //         });
    //     }
    // } catch (error) {
    //     console.error("Error generating new access token:", error);
    //     return res.status(500).json({ success: false, message: 'Internal server error' });
    // }
    try {
            const decoded = await jwt.VerifyJwt(token)
            if (decoded && decoded.role != 'user') {
                return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
            }
            if (decoded && decoded.id) {
                let user = await repository.findById(decoded.id)
                if (user?.isBlocked === true) {
                    return res.status(401).send({ success: false, message: 'User is blocked !!' })
                } else {
                    req.userId = decoded.id
                    next()
                }
            } else {
                return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
            }
    } catch (error) {
        console.log(error)
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}


export default userAuth

import { Request, Response, NextFunction } from 'express'
import JwtToken from '../services/JwtToken';
import dotenv from 'dotenv';
import userRepository from '../repository/userRepository';
import { TokenExpiredError } from 'jsonwebtoken';
const repository = new userRepository();
const jwt = new JwtToken();
dotenv.config()


declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    // const RefreshToken = req.headers.authorization?.split(" ")[1] as string;
    // const token= req.headers.authorization?.split(" ")[1] as string;

    // // const refreshToken = req.headers.refreshtoken
    // // console.log("refresh",refreshToken)
    // // let token = req.cookies.userToken;
    // let RefreshToken = req.cookies.refreshToken;
    // console.log("token user",token)
    // if (!RefreshToken) {
    //     return res.json({ success: false, message: 'Token expired or not available' });
    // }
    // if (!token) {
    //     try {
    //         const refreshToken = await jwt.VerifyRefreshJwt(RefreshToken);
    //         console.log("refresh token",refreshToken?.id)

    //         if (refreshToken) {

    //             const newAccessToken = await jwt.SignJwt(refreshToken.id, refreshToken.role);
    //             res.locals.newAccessToken = newAccessToken;
    //             // res.cookie('userToken', newAccessToken, {
    //             //     sameSite: "none",
    //             //     secure: true
    //             // })
    //         }
    //     } catch (error) {
    //         console.error("Error generating new access token:", error);
    //         return res.status(500).json({ success: false, message: 'Internal server error' });
    //     }
    // }

    // try {
    //         const decoded = await jwt.VerifyJwt(token)
    //         if (decoded && decoded.role != 'user') {
    //             return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    //         }
    //         if (decoded && decoded.id) {
    //             let user = await repository.findById(decoded.id)
    //             if (user?.isBlocked === true) {
    //                 return res.status(401).send({ success: false, message: 'User is blocked !!' })
    //             } else {
    //                 req.userId = decoded.id
    //                 next()
    //             }
    //         } else {
    //             return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    //         }
    // } catch (error) {
    //     console.log(error)
    //     return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    // }
    const token = req.headers.authorization?.split(" ")[1] as string;
    const RefreshToken = req.cookies.refreshToken as string;


    if (!token) {
        console.log("unauthorized-1");

        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token provided" });
    }

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
        }
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
                console.log("new access",res.locals.newAccessToken)

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


export default userAuth
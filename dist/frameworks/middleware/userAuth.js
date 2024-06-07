"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const jsonwebtoken_1 = require("jsonwebtoken");
const repository = new userRepository_1.default();
const jwt = new JwtToken_1.default();
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const RefreshToken = req.headers.authorization?.split(" ")[1] as string;
    // const token= req.headers.authorization?.split(" ")[1] as string;
    var _a;
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
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const RefreshToken = req.cookies.refreshToken;
    if (!token) {
        console.log("unauthorized-1");
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = yield jwt.VerifyJwt(token);
        if (decoded && decoded.role != 'user') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
        if (decoded && decoded.id) {
            let user = yield repository.findById(decoded.id);
            if ((user === null || user === void 0 ? void 0 : user.isBlocked) === true) {
                return res.status(401).send({ success: false, message: 'User is blocked !!' });
            }
            else {
                req.userId = decoded.id;
                next();
            }
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            if (!RefreshToken) {
                console.log("unauthorized-3");
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized - Invalid token" });
            }
            try {
                const refreshToken = yield jwt.VerifyRefreshJwt(RefreshToken);
                console.log("refresh token", refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.id);
                let user = yield repository.findById(refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.id);
                if (!user) {
                    console.log("unauthorized-4");
                    return res
                        .status(401)
                        .send({ success: false, message: "User not found" });
                }
                const newAccessToken = yield jwt.SignJwt(refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.id, refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.role);
                res.locals.newAccessToken = newAccessToken;
                console.log("new access", res.locals.newAccessToken);
                req.userId = refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.id;
                if (res.locals.newAccessToken) {
                    return res.status(200).json({ success: true, newAccessToken: res.locals.newAccessToken });
                }
                else {
                    return next();
                }
            }
            catch (refreshError) {
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
});
exports.default = userAuth;

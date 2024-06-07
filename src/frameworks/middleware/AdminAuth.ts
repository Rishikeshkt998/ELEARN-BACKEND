// import { Request, Response, NextFunction } from 'express'
// import JwtToken from '../services/JwtToken';
// import dotenv from 'dotenv';
// import adminRepository from '../repository/adminRepository';
// const repository = new adminRepository();
// const jwt = new JwtToken();


// dotenv.config()

// declare global {
//     namespace Express {
//         interface Request {
//             adminId?: string
//         }
//     }
// }

// const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         let token = req.cookies.adminToken
//         if (!token) {
//             return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
//         }
//         const decoded = await jwt.VerifyJwt(token)

//         if (decoded) {
//             let user = await repository.findAdminByEmail(decoded.toString());
//             console.log('user details is below');
//             console.log(user);
//             req.adminId = decoded.toString();
//             next();
//         } else {
//             return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" })
//         }
//     } catch (err) {
//         console.log(err); console.log('error is in the catch block!');
//         return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
//     }
// }

// export default adminAuth;
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import JwtToken from '../services/JwtToken';
import adminRepository from '../repository/adminRepository';
const repository = new adminRepository();
const Jwt = new JwtToken();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            adminId?: string
        }
    }
}

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1] as string;
    // let token = req.cookies.adminToken;
    console.log("token", token)
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
    }
    try {

        const decoded=await Jwt.VerifyJwt(token)
        if (decoded && decoded.role != 'admin') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
        }
        if (decoded && decoded.id) {
            let admin = await repository.findAdminById(decoded.id)
            console.log(decoded)
            console.log("user", admin)
            if (decoded?.isBlocked) {
                return res.status(401).send({ success: false, message: 'admin is blocked !!' })
            } else {
                req.adminId = decoded.id
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

export default adminAuth 
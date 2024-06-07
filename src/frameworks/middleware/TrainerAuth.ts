
import { Request, Response, NextFunction } from 'express'
import JwtToken from '../services/JwtToken';
import dotenv from 'dotenv';
import trainerRepository from '../repository/trainerRepository'
const repository = new trainerRepository();
const jwt = new JwtToken();
dotenv.config()

dotenv.config()

declare global {
    namespace Express {
        interface Request {
            trainerId?: string
        }
    }
}

const TrainerAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1] as string;
    // let token = req.cookies.trainerToken;
    console.log("token  trainer", token)
    // if (!token) {
    //     return res.status(401).json({ success: false, message: "Unauthorized - No token provided" })
    // }
    try {
        const decoded = await jwt.VerifyJwt(token)
        console.log("decoded",decoded)
        if (decoded && decoded.role != 'trainer') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
        }
        if (decoded && decoded.id) {
            let trainer = await repository.findTutorById(decoded.id)
            console.log("trainer",trainer)
            console.log(decoded)
            if (decoded?.isBlocked) {
                return res.status(401).send({ success: false, message: 'User is blocked !!' })
            } else {
                req.trainerId = decoded.id
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

export default TrainerAuth
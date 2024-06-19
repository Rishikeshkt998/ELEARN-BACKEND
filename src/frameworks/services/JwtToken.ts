import IjwtToken from '../../useCase/interface/IjwtToken'
import jwt,{JwtPayload, Secret} from 'jsonwebtoken'

class JwtToken implements IjwtToken {

    async SignUserJwt(userId: string, role: string):Promise<string>{
        const jwtToken = process.env.JWT_SECRET_KEY as  Secret
        if(jwtToken){
            const token: string = jwt.sign({ id: userId, role: role }, jwtToken, {
                expiresIn: "5m",
            })
            return token
        }
        throw new Error('jwt key is not found')
        
    }
    async SignJwt(userId: string, role: string): Promise<string> {
        const jwtToken = process.env.JWT_SECRET_KEY as Secret
        if (jwtToken) {
            const token: string = jwt.sign({ id: userId, role: role }, jwtToken, {
                expiresIn: "30d",
            })
            return token
            
        }
        throw new Error('jwt key is not found')

    }
    async VerifyJwt(token: string): Promise<JwtPayload | null> {
        const jwtToken=process.env.JWT_SECRET_KEY as string
        const verified=jwt.verify(token,jwtToken) as JwtPayload
        return verified
        
    }

    async refreshToken(userId: string, role: string): Promise<string> {
        const jwtToken =process.env.JWT_REFRESH_SECRET_KEY as Secret
        if (jwtToken) {
           
            const token: string = jwt.sign({ id: userId, role: role }, jwtToken, {
                expiresIn: "30d",
            })
            return token
        }
        throw new Error('jwt key is not found')
    }
    async VerifyRefreshJwt(token: string): Promise<JwtPayload | null> {
        const jwtToken =process.env.JWT_REFRESH_SECRET_KEY as string
        const verified = jwt.verify(token, jwtToken) as JwtPayload
        return verified

    }

    


}

export default JwtToken
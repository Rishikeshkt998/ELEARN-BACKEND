import {JwtPayload} from "jsonwebtoken"

interface IjwtToken {
    SignJwt(userId: string, role: string): Promise<string>
    VerifyJwt(token: string): Promise<JwtPayload | null>
    refreshToken(userId: string, role: string): Promise<string>
    VerifyRefreshJwt(token: string): Promise<JwtPayload | null>
    // SignJwt(payload: object): Promise<string> 
    // VerifyJwt(token: string): Promise<JwtPayload | null>
    // refreshToken(payload: object): Promise<string> 
    // VerifyRefreshJwt(token: string): Promise<JwtPayload | null>
    
}
export default IjwtToken
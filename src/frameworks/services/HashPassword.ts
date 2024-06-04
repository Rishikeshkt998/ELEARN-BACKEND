import bcrypt from 'bcrypt'
import IhashPassword from '../../useCase/interface/IhashPassword';


class HashPassword implements IhashPassword{
    async Hashing(password: string): Promise<string> {
        const hashpassword=bcrypt.hash(password,10)
        return hashpassword
        
    }
    async Compare(password: string, hashedpassowrd: string): Promise<boolean> {
        const matchingpassword=bcrypt.compare(password,hashedpassowrd)
        return matchingpassword
        
    }


}

export default HashPassword
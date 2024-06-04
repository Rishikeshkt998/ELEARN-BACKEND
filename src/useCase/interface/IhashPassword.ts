

interface IhashPassword {
    Hashing(password: string): Promise<string>
    Compare(password: string,hashedpassowrd:string): Promise<boolean>
}
export default IhashPassword
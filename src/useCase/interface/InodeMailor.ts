

interface InodeMailor {
    SendOtp(email:string):Promise<boolean>
    VerifyOtp(email:string,otp:string):Promise<boolean>
}
export default InodeMailor
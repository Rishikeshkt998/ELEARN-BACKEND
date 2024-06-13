interface Trainer {
    _id?: string,
    name: string,
    email: string,
    password: string,
    dateOfBirth?: Date,
    image?: string,
    phone?: string,
    otp?: string;
    isBlocked?: boolean,
    isVerified?:boolean,
    isVerifiedUser?:boolean
    creationTime?: Date,

}


export default Trainer
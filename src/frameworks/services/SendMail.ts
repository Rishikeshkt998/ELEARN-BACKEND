import nodemailer from 'nodemailer'
import InodeMailor from '../../useCase/interface/InodeMailor';
import dotenv from "dotenv";


class sendMail{
    private transporter:nodemailer.Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:process.env.AUTH_EMAIL,
                pass:process.env.AUTH_PASS 
            },
            authMethod: 'PLAIN'
        })
    }
    SendMail(name:string,email:string,verificationotp:string):void{
        const mailOptions:nodemailer.SendMailOptions= {
            from: "rishikt690@gmail.com",
            to: email,
            subject: 'Email verification',
            html: `Dear ${name},
            <p>Enter <b>${verificationotp}</b> in the app to verify your email address.</p>
            <p>This code will <b>Expires in one hour</b></p>`
        };

        this.transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log(err);
                console.log('unknown error ');
            } else {
                console.log('otp successfull');
               
            }
        });

    }
}

export default sendMail
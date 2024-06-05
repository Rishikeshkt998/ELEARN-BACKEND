"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class sendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            },
            authMethod: 'PLAIN'
        });
    }
    SendMail(name, email, verificationotp) {
        const mailOptions = {
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
            }
            else {
                console.log('otp successfull');
            }
        });
    }
}
exports.default = sendMail;

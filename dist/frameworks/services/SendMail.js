"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class sendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 2525,
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });
    }
    SendMail(name, email, verificationotp) {
        const mailOptions = {
            from: "rishikt8465@gmail.com",
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

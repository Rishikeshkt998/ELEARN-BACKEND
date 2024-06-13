"use strict";
// import PDFDocument from "pdfkit";
// import { Response } from "express";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificate = void 0;
// const doc = new PDFDocument({
//     size: "A4",
//     margin: 50,
//     layout: "portrait",
// });
// export function generateCertificate(
//     stream: Response,
//     name: string,
//     course: string,
//     date: Date
// ) {
//     doc.pipe(stream);
//     // const logoPath = "https://img.graphicsurf.com/2020/06/Banner-e-learning-concept-vector-design.jpg";
//     // Adding a light blue border
//     const borderWidth = 2;
//     const borderPadding = 10;
//     doc
//         .lineWidth(borderWidth)
//         .strokeColor("#ADD8E6") // Light blue color
//         .rect(
//             borderPadding,
//             borderPadding,
//             doc.page.width - 2 * borderPadding,
//             doc.page.height - 2 * borderPadding
//         )
//         .stroke();
//     // Adding a logo
//     // if (logoPath) {
//     //     doc.image(logoPath, doc.page.width / 2 - 50, 40, { width: 100 });
//     //     doc.moveDown(2);
//     // }
//     // Title
//     doc
//         .font("Helvetica-Bold")
//         .fontSize(30)
//         .fillColor("#000000")
//         .text("Certificate of Completion", {
//             align: "center",
//         })
//         .moveDown(1);
//     // Decorative line
//     doc
//         .moveTo(doc.page.width / 4, doc.y)
//         .lineTo((doc.page.width / 4) * 3, doc.y)
//         .stroke()
//         .moveDown(1);
//     // Subtitle
//     doc
//         .font("Helvetica")
//         .fontSize(20)
//         .text("This is to certify that", {
//             align: "center",
//         })
//         .moveDown(1);
//     // Recipient's name
//     doc
//         .font("Helvetica-Bold")
//         .fontSize(25)
//         .fillColor("#003366")
//         .text(name.toUpperCase(), {
//             align: "center",
//         })
//         .moveDown(1);
//     // Course details
//     doc
//         .font("Helvetica")
//         .fontSize(20)
//         .fillColor("#000000")
//         .text("has successfully completed the", {
//             align: "center",
//         })
//         .moveDown(1)
//         .font("Helvetica-Bold")
//         .fontSize(25)
//         .fillColor("#003366")
//         .text(course.toUpperCase(), {
//             align: "center",
//         })
//         .moveDown(1);
//     // Format the date
//     const formattedDate = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//     });
//     // Date
//     doc
//         .font("Helvetica")
//         .fontSize(20)
//         .fillColor("#000000")
//         .text(`course on ${formattedDate}.`, {
//             align: "center",
//         })
//         .moveDown(3);
//     // Instructor Signature
//     doc
//         .fontSize(15)
//         .fillColor("#000000")
//         .text("______________________________", {
//             align: "center",
//         })
//         .text("Instructor Signature", {
//             align: "center",
//         });
//     // Footer (optional)
//     // Finalize PDF file
//     doc.end();
// }
const pdfkit_1 = __importDefault(require("pdfkit"));
function generateCertificate(res, name, course, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = new pdfkit_1.default({
            size: "A4",
            margin: 50,
            layout: "portrait",
        });
        // Pipe the PDF document to the response stream
        doc.pipe(res);
        // Setting response headers
        res.setHeader("Content-Disposition", `attachment; filename="certificate.pdf"`);
        res.setHeader("Content-Type", "application/pdf");
        // PDF content generation
        const borderWidth = 2;
        const borderPadding = 10;
        doc.lineWidth(borderWidth)
            .strokeColor("#ADD8E6")
            .rect(borderPadding, borderPadding, doc.page.width - 2 * borderPadding, doc.page.height - 2 * borderPadding)
            .stroke();
        doc.font("Helvetica-Bold")
            .fontSize(30)
            .fillColor("#000000")
            .text("Certificate of Completion", { align: "center" })
            .moveDown(1);
        doc.moveTo(doc.page.width / 4, doc.y)
            .lineTo((doc.page.width / 4) * 3, doc.y)
            .stroke()
            .moveDown(1);
        doc.font("Helvetica")
            .fontSize(20)
            .text("This is to certify that", { align: "center" })
            .moveDown(1);
        doc.font("Helvetica-Bold")
            .fontSize(25)
            .fillColor("#003366")
            .text(name.toUpperCase(), { align: "center" })
            .moveDown(1);
        doc.font("Helvetica")
            .fontSize(20)
            .fillColor("#000000")
            .text("has successfully completed the", { align: "center" })
            .moveDown(1);
        doc.font("Helvetica-Bold")
            .fontSize(25)
            .fillColor("#003366")
            .text(course.toUpperCase(), { align: "center" })
            .moveDown(1);
        const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        doc.font("Helvetica")
            .fontSize(20)
            .fillColor("#000000")
            .text(`course on ${formattedDate}.`, { align: "center" })
            .moveDown(3);
        doc.fontSize(15)
            .fillColor("#000000")
            .text("______________________________", { align: "center" })
            .text("Instructor Signature", { align: "center" });
        // Finalize the PDF
        doc.end();
    });
}
exports.generateCertificate = generateCertificate;

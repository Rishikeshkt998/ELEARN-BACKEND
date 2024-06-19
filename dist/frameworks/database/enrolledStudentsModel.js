"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrolledStudentsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enrolledStudentsSchema = new mongoose_1.Schema({
    courseId: {
        type: String,
        ref: "course",
    },
    studentId: {
        type: String,
        ref: "user",
    },
    enrolledTime: {
        type: Date,
        default: Date.now,
    },
    completedLessons: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Chapter",
        },
    ],
    completedChapters: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Chapter",
        },
    ],
    attendedQuestions: [
        {
            type: String,
            ref: "Chapter"
        },
    ],
    attendedWrongQuestions: [
        {
            type: String,
            ref: "Chapter"
        },
    ],
    completedDate: {
        type: Date,
        default: 0
    },
    courseStatus: {
        type: Boolean,
        default: false
    }
});
const enrolledStudentsModel = mongoose_1.default.model('enrolledstudents', enrolledStudentsSchema);
exports.enrolledStudentsModel = enrolledStudentsModel;

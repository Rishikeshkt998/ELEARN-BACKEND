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
exports.courseModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "please give a valid name"],
        min: [3, "name should be atleast 3"]
    },
    description: {
        type: String,
        required: [true, "please give a valid description"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "please give a valid price"],
        trim: true,
    },
    estimatedPrice: {
        type: Number,
        required: [true, "please give a valid price"],
        trim: true,
    },
    category: {
        type: String,
        min: [3, "name should have atleast 3 charactor"],
        required: [true, "please give a valid category"],
        trim: true,
    },
    instructorId: {
        type: String,
    },
    tags: {
        type: String,
    },
    level: {
        type: Number
    },
    demoUrl: {
        type: String
    },
    thumbnail: {
        type: String,
    },
    benefits: [{
            title: {
                type: String
            }
        }],
    prerequisite: [{
            title: {
                type: String
            }
        }],
    chapters: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'chapter',
    },
    image: {
        type: String
    },
    adminVerified: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number
    },
    noOfPurchase: {
        type: Number
    },
    approved: {
        type: Boolean,
        default: false,
    },
    listed: {
        type: Boolean,
        default: true,
    },
    publish: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPurchased: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date, default: Date.now
    },
    reviews: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'user',
            },
            comments: {
                type: String,
                required: true,
            },
            rating: {
                type: Number
            },
            commentreplies: [
                {
                    type: String
                }
            ],
            createdAt: {
                type: Date, default: Date.now
            }
        },
    ],
    meeting: {
        meetingDate: String,
        meetingTime: String,
        meetingCode: String,
        description: String
    },
    questions: [
        {
            type: String,
            ref: "question",
        },
    ],
});
const courseModel = mongoose_1.default.model('course', courseSchema);
exports.courseModel = courseModel;

import { Schema, model } from "mongoose";
import Chapter from "../../domain_entities/Chapters";
const ChapterSchema = new Schema<Chapter>({
    chapters: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        lessons: [{
            title: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
        ],
        course: {
            type: String,
            ref: "course",
        },
        order: {
            type: Number,
            require: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }]
});

const chapterModel = model<Chapter>("Chapter", ChapterSchema);
export default chapterModel;



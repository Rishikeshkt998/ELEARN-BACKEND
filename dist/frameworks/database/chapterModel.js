"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChapterSchema = new mongoose_1.Schema({
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
const chapterModel = (0, mongoose_1.model)("Chapter", ChapterSchema);
exports.default = chapterModel;

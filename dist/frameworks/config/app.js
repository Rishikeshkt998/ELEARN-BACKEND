"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRouter_1 = __importDefault(require("../routes/adminRouter"));
const TrainerRouter_1 = __importDefault(require("../routes/TrainerRouter"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const Socketio_1 = __importDefault(require("./Socketio"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(body_parser_1.default.json({ limit: '10mb' }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            // origin: 'http://localhost:3000',
            origin: process.env.ORIGIN || "*",
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));
        app.use('/api/user', userRoutes_1.default);
        app.use('/api/admin', adminRouter_1.default);
        app.use('/api/trainer', TrainerRouter_1.default);
        const server = http_1.default.createServer(app);
        (0, Socketio_1.default)(server);
        return server;
    }
    catch (error) {
        console.log('created server error:', error);
    }
};
exports.createServer = createServer;

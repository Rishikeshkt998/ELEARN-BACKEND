"use strict";
// import { Request, Response, NextFunction } from 'express'
// import JwtToken from '../services/JwtToken';
// import dotenv from 'dotenv';
// import adminRepository from '../repository/adminRepository';
// const repository = new adminRepository();
// const jwt = new JwtToken();
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
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const dotenv_1 = __importDefault(require("dotenv"));
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const repository = new adminRepository_1.default();
const jwt = new JwtToken_1.default();
dotenv_1.default.config();
dotenv_1.default.config();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    // let token = req.cookies.adminToken;
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = yield jwt.VerifyJwt(token);
        if (decoded && decoded.role != 'admin') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
        if (decoded && decoded.id) {
            let admin = yield repository.findAdminById(decoded.id);
            console.log(decoded);
            console.log("user", admin);
            if (decoded === null || decoded === void 0 ? void 0 : decoded.isBlocked) {
                return res.status(401).send({ success: false, message: 'admin is blocked !!' });
            }
            else {
                req.adminId = decoded.id;
                next();
            }
        }
        else {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
});
exports.default = adminAuth;

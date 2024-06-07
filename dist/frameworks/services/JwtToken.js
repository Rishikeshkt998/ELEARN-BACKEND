"use strict";
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtToken {
    SignJwt(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = process.env.JWT_SECRET_KEY;
            if (jwtToken) {
                const token = jsonwebtoken_1.default.sign({ id: userId, role: role }, jwtToken);
                return token;
            }
            throw new Error('jwt key is not found');
        });
    }
    VerifyJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = process.env.JWT_SECRET_KEY;
            const verified = jsonwebtoken_1.default.verify(token, jwtToken);
            return verified;
        });
    }
    refreshToken(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = process.env.JWT_REFRESH_SECRET_KEY;
            if (jwtToken) {
                const token = jsonwebtoken_1.default.sign({ id: userId, role: role }, jwtToken);
                return token;
            }
            throw new Error('jwt key is not found');
        });
    }
    VerifyRefreshJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = process.env.JWT_REFRESH_SECRET_KEY;
            const verified = jsonwebtoken_1.default.verify(token, jwtToken);
            return verified;
        });
    }
}
exports.default = JwtToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.PORT = Number(process.env.PORT) || 3001;
exports.app.get("/", (req, res) => {
    res.status(200).json({
        message: "Get Data",
    });
});
//# sourceMappingURL=app.js.map
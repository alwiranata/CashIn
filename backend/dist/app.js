"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const routes_1 = __importDefault(require("./routes"));
exports.app = (0, express_1.default)();
exports.PORT = Number(process.env.PORT) || 3001;
exports.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// 🔥 FIX RAW-BODY ERROR
exports.app.use(express_1.default.json({ limit: "10mb" }));
exports.app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
exports.app.use("/api", routes_1.default);
exports.default = exports.app;
//# sourceMappingURL=app.js.map
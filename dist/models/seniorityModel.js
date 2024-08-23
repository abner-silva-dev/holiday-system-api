"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const senioritySchema = new Schema({
    name: { type: String, requiere: [true, "A seniority must have a name"] },
});
const SeniorityModel = mongoose_1.default.model("Seniority", senioritySchema);
exports.default = SeniorityModel;
//# sourceMappingURL=seniorityModel.js.map
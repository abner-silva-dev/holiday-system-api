"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const enterpriseSchema = new Schema({
    name: { type: String, requiere: [true, "An enterprise must be have a name"] },
    nameAbreviate: {
        type: String,
        requiere: [true, "An enterprise must have an abreviated name"],
    },
    email: {
        type: String,
        requiere: [true, "An enterprise must be have an email"],
    },
    phoneNumber: {
        type: String,
        requiere: [true, "An enterprise must be have a phone number"],
    },
    logo: { type: String },
});
const Enterprise = mongoose_1.default.model("Enterprise", enterpriseSchema);
exports.default = Enterprise;
//# sourceMappingURL=enterpriseModel.js.map
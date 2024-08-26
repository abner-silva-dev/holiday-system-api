"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const senioritySchema = new Schema({
    name: { type: String, requiere: [true, "A seniority must have a name"] },
    yearsOld: {
        type: Number,
        requiere: [true, "A seniority must have years old"],
    },
    daysAvailables: {
        type: Number,
        requiere: [true, "A seniority must have days availables"],
    },
});
const Seniority = mongoose_1.default.model("Seniority", senioritySchema);
exports.default = Seniority;
//# sourceMappingURL=seniorityModel.js.map
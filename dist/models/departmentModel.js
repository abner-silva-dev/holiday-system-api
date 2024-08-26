"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const departmentSchema = new Schema({
    name: { type: String, requiere: [true, "A department must be have a name"] },
    enterprise: {
        type: Schema.Types.ObjectId,
        ref: "Enterprise",
        required: [true, "A department must be associated with an enterprise"],
    },
});
const Department = mongoose_1.default.model("Department", departmentSchema);
exports.default = Department;
//# sourceMappingURL=departmentModel.js.map
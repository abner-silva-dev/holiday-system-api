"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const holidaySchema = new Schema({
    name: { type: String, requiere: [true, "A holiday must be have a name"] },
});
const HolidayModel = mongoose_1.default.model("Holiday", holidaySchema);
exports.default = HolidayModel;
//# sourceMappingURL=holidayModel.js.map
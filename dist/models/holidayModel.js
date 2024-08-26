"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const holidaySchema = new Schema({
    name: { type: String, requiere: [true, "A holiday must have a name"] },
    startingDate: {
        type: Date,
        requiere: [true, "A holiday must have a starting date"],
    },
    endDate: {
        type: Date,
        requiere: [true, "A holiday must have an end date"],
    },
    authorizationAnticipate: { type: Boolean },
    authorizationMannager: { type: Boolean },
    observation: { type: String },
    mannagerName: {
        type: String,
        requiere: [true, "A holiday must have a mannager name"],
    },
    adminName: {
        type: String,
        requiere: [true, "A holiday must have an admin name"],
    },
    firmEmployer: {
        type: String,
        requiere: [true, "A holiday must have an employer firm"],
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "-email -role",
//   });
//   next();
// });
// holidaySchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });
const Holiday = mongoose_1.default.model("Holiday", holidaySchema);
exports.default = Holiday;
//# sourceMappingURL=holidayModel.js.map
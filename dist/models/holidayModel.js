"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const holidaySchema = new Schema({
    days: {
        type: [Date],
        requiere: [true, "A holiday must have a day for create holidays"],
    },
    authorizationAdmin: { type: Boolean },
    authorizationMannager: { type: Boolean },
    observation: { type: String },
    mannager: {
        type: String,
        requiere: [true, "A holiday must have a mannager name"],
    },
    admin: {
        type: String,
        requiere: [true, "A holiday must have an admin name"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A holiday must be associated with a user"],
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });
holidaySchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "",
    });
    this.populate({
        path: "admin",
        select: "",
    });
    this.populate({
        path: "mannager",
        select: "",
    });
    next();
});
// holidaySchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "tour",
//   localField: "_id",
// });
const Holiday = mongoose_1.default.model("Holiday", holidaySchema);
exports.default = Holiday;
//# sourceMappingURL=holidayModel.js.map
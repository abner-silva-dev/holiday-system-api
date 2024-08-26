"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const usersSchema = new Schema({
    name: { type: String, requiere: [true, "A user must have a name"] },
    employNumber: {
        type: String,
        requiere: [true, "A user must have an employ number"],
    },
    email: { type: String, requiere: [true, "A user must have an email"] },
    phoneNumber: {
        type: String,
        requiere: [true, "A user must have a phone number"],
    },
    enterprise: {
        type: Schema.Types.ObjectId,
        ref: "Enterprise",
        required: [true, "A user must be associated with an enterprise"],
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: [true, "A user must be associated with a department"],
    },
    // seniority: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Seniority",
    //   required: [true, "A user must be associated with a seniority"],
    // },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// VIRTUAL POPULATE
usersSchema.virtual("holiday", {
    ref: "Holiday",
    foreignField: "holiday",
    localField: "_id",
});
// POPULATE
usersSchema.pre(/^find/, function (next) {
    this.populate({
        path: "department",
        select: "-email -role",
    });
    this.populate({
        path: "enterprise",
        select: "-email -role",
    });
    next();
});
const User = mongoose_1.default.model("User", usersSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map
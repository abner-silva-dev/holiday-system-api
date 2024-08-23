"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const usersSchema = new Schema({
    name: { type: String, requiere: [true, "Users must have a name"] },
});
const UsersModel = mongoose_1.default.model("Users", usersSchema);
exports.default = UsersModel;
//# sourceMappingURL=usersModel.js.map
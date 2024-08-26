"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllUser = (0, handleFactory_1.getAll)(userModel_1.default);
exports.getUser = (0, handleFactory_1.getOne)(userModel_1.default);
exports.createUser = (0, handleFactory_1.createOne)(userModel_1.default);
exports.updateUser = (0, handleFactory_1.updateOne)(userModel_1.default);
exports.deleteUser = (0, handleFactory_1.deleteOne)(userModel_1.default);
//# sourceMappingURL=usersController.js.map
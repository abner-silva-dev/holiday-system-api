"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUser = void 0;
const usersModel_1 = __importDefault(require("../models/usersModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllUser = (0, handleFactory_1.getAll)(usersModel_1.default);
exports.getUser = (0, handleFactory_1.getOne)(usersModel_1.default);
exports.createUser = (0, handleFactory_1.createOne)(usersModel_1.default);
exports.updateUser = (0, handleFactory_1.updateOne)(usersModel_1.default);
exports.deleteUser = (0, handleFactory_1.deleteOne)(usersModel_1.default);
//# sourceMappingURL=usersController.js.map
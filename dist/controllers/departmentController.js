"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.createDepartment = exports.getDepartment = exports.getAllDepartment = void 0;
const departmentModel_1 = __importDefault(require("../models/departmentModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllDepartment = (0, handleFactory_1.getAll)(departmentModel_1.default);
exports.getDepartment = (0, handleFactory_1.getOne)(departmentModel_1.default);
exports.createDepartment = (0, handleFactory_1.createOne)(departmentModel_1.default);
exports.updateDepartment = (0, handleFactory_1.updateOne)(departmentModel_1.default);
exports.deleteDepartment = (0, handleFactory_1.deleteOne)(departmentModel_1.default);
//# sourceMappingURL=departmentController.js.map
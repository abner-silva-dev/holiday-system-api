"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSeniority = exports.updateSeniority = exports.createSeniority = exports.getSeniority = exports.getAllSeniority = void 0;
const seniorityModel_1 = __importDefault(require("../models/seniorityModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllSeniority = (0, handleFactory_1.getAll)(seniorityModel_1.default);
exports.getSeniority = (0, handleFactory_1.getOne)(seniorityModel_1.default);
exports.createSeniority = (0, handleFactory_1.createOne)(seniorityModel_1.default);
exports.updateSeniority = (0, handleFactory_1.updateOne)(seniorityModel_1.default);
exports.deleteSeniority = (0, handleFactory_1.deleteOne)(seniorityModel_1.default);
//# sourceMappingURL=seniorityController.js.map
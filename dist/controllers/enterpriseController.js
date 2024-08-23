"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnterprise = exports.updateEnterprise = exports.createEnterprise = exports.getEnterprise = exports.getAllEnterprise = void 0;
const enterpriseModel_1 = __importDefault(require("../models/enterpriseModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllEnterprise = (0, handleFactory_1.getAll)(enterpriseModel_1.default);
exports.getEnterprise = (0, handleFactory_1.getOne)(enterpriseModel_1.default);
exports.createEnterprise = (0, handleFactory_1.createOne)(enterpriseModel_1.default);
exports.updateEnterprise = (0, handleFactory_1.updateOne)(enterpriseModel_1.default);
exports.deleteEnterprise = (0, handleFactory_1.deleteOne)(enterpriseModel_1.default);
//# sourceMappingURL=enterpriseController.js.map
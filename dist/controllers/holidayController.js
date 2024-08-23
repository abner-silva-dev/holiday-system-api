"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHoliday = exports.updateHoliday = exports.createHoliday = exports.getHoliday = exports.getAllHoliday = void 0;
const holidayModel_1 = __importDefault(require("../models/holidayModel"));
const handleFactory_1 = require("./handleFactory");
exports.getAllHoliday = (0, handleFactory_1.getAll)(holidayModel_1.default);
exports.getHoliday = (0, handleFactory_1.getOne)(holidayModel_1.default);
exports.createHoliday = (0, handleFactory_1.createOne)(holidayModel_1.default);
exports.updateHoliday = (0, handleFactory_1.updateOne)(holidayModel_1.default);
exports.deleteHoliday = (0, handleFactory_1.deleteOne)(holidayModel_1.default);
//# sourceMappingURL=holidayController.js.map
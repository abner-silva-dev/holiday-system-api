"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHoliday = exports.getHoliday = exports.getAllHoliday = void 0;
const holidayModel_1 = __importDefault(require("../models/holidayModel"));
const getAllHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const holidays = yield holidayModel_1.default.find({});
        res.json({
            status: "success",
            data: holidays,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllHoliday = getAllHoliday;
const getHoliday = (req, res) => {
    res.json({
        status: "success",
        data: [{ id: "2342342", name: "ss " }],
    });
};
exports.getHoliday = getHoliday;
const createHoliday = (req, res) => { };
exports.createHoliday = createHoliday;
//# sourceMappingURL=holidayController.js.map
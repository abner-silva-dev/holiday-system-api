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
exports.createDepartment = exports.getDepartment = exports.getAllDepartment = void 0;
const departmentModel_1 = __importDefault(require("../models/departmentModel"));
const getAllDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield departmentModel_1.default.find({});
        res.json({
            status: "success",
            data: departments,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllDepartment = getAllDepartment;
const getDepartment = (req, res) => {
    res.json({
        status: "success",
        data: [{ id: "2342342", name: "recursos humanos " }],
    });
};
exports.getDepartment = getDepartment;
const createDepartment = (req, res) => { };
exports.createDepartment = createDepartment;
//# sourceMappingURL=departmentController.js.map
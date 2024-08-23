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
exports.createEnterprise = exports.getEnterprise = exports.getAllEnterprise = void 0;
const enterpriseModel_1 = __importDefault(require("../models/enterpriseModel"));
const getAllEnterprise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enterprise = yield enterpriseModel_1.default.find({});
        res.json({
            status: "success",
            data: enterprise,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllEnterprise = getAllEnterprise;
const getEnterprise = (req, res) => {
    res.json({
        status: "success",
        data: [{ id: "2342342", name: "recursos humanos " }],
    });
};
exports.getEnterprise = getEnterprise;
const createEnterprise = (req, res) => { };
exports.createEnterprise = createEnterprise;
//# sourceMappingURL=enterpriseController.js.map
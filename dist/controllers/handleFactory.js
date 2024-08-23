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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
const getAll = (Model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Model.find({});
            res.status(200).json({
                status: "success",
                results: data.length,
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
};
exports.getAll = getAll;
const getOne = (Model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.params.id);
            const data = yield Model.findById(req.params.id);
            console.log(data);
            if (!data) {
                throw new Error("Data don't exist");
            }
            res.status(200).json({
                status: "success",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
};
exports.getOne = getOne;
const createOne = (Model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const data = yield Model.create(req.body);
            if (!data) {
                throw new Error("Data don't exitst");
            }
            res.status(200).json({
                status: "success",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
};
exports.createOne = createOne;
const updateOne = (Model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!data) {
                throw new Error("Data don't exitst");
            }
            res.status(200).json({
                status: "success",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
};
exports.updateOne = updateOne;
const deleteOne = (Model) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Model.findByIdAndDelete(req.params.id);
            if (!data) {
                throw new Error("Data don't exitst");
            }
            res.status(200).json({
                status: "success",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
};
exports.deleteOne = deleteOne;
//# sourceMappingURL=handleFactory.js.map
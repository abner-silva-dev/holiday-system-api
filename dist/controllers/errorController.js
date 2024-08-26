"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorController = (err, req, res, next) => {
    const appError = err;
    appError.statusCode = appError.statusCode || 500;
    appError.status = appError.status || "error";
    // A) API
    res.status(appError.statusCode).json({
        status: appError.status,
        error: appError,
        message: appError.message,
        stack: appError.stack,
    });
    // B) RENDERED WEBSITE
    console.error("ERROR 🔥", err);
    res
        .status(appError.statusCode)
        .render("error", { title: "something went wrong!", msg: err.message });
};
exports.default = errorController;
//# sourceMappingURL=errorController.js.map
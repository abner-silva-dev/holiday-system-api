"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentRoutes_1 = __importDefault(require("../routes/departmentRoutes"));
const holidayRoutes_1 = __importDefault(require("../routes/holidayRoutes"));
const enterpriseRoutes_1 = __importDefault(require("../routes/enterpriseRoutes"));
const usersRoutes_1 = __importDefault(require("../routes/usersRoutes"));
const seniorityRoutes_1 = __importDefault(require("../routes/seniorityRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        // INIT ROUTES
        this.routes();
    }
    routes() {
        this.app.use("/department", departmentRoutes_1.default);
        this.app.use("/holiday", holidayRoutes_1.default);
        this.app.use("/enterprise", enterpriseRoutes_1.default);
        this.app.use("/seniority", seniorityRoutes_1.default);
        this.app.use("/users", usersRoutes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listem in port ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map
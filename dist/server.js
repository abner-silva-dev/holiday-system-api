"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const departmentRoutes_1 = __importDefault(require("../routes/departmentRoutes"));
const holidayRoutes_1 = __importDefault(require("../routes/holidayRoutes"));
const enterpriseRoutes_1 = __importDefault(require("../routes/enterpriseRoutes"));
const usersRoutes_1 = __importDefault(require("../routes/usersRoutes"));
const seniorityRoutes_1 = __importDefault(require("../routes/seniorityRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        // MIDDLEWARES
        this.middlewares();
        // INIT ROUTES
        this.routes();
    }
    middlewares() {
        // ABLE CORS
        this.app.use((0, cors_1.default)());
        // ABLE BODY REQUEST
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        // this.app.use("/", (req, res) => {
        //   res.end("API asdfS");
        // });
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
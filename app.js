"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./models/server");
var connection_1 = require("./db/connection");
require("dotenv/config");
(0, connection_1.default)();
var server = new server_1.default();
server.listen();

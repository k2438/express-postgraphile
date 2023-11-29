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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const pg_1 = require("pg");
const postgraphile_1 = require("postgraphile");
dotenv_1.default.config();
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pool.connect();
    }
    catch (err) {
        console.log(err);
    }
});
connectToDB();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('Hello, Express');
}));
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title } = req.body;
    const todoId = id !== null && id !== void 0 ? id : (0, uuid_1.v4)();
    try {
        const query = {
            text: 'INSERT INTO todos(id, title) VALUES($1, $2)',
            values: [todoId, title],
        };
        yield pool.query(query);
        res.status(200).send({ id: todoId });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
app.use((0, postgraphile_1.postgraphile)(process.env.DATABASE_URL || "postgres://postgres:password@db:5432/db_name", "public", {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
}));
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { Pool } from 'pg';
import { postgraphile } from "postgraphile";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const connectToDB = async () => {
    try {
        await pool.connect();
    } catch (err) {
        console.log(err);
    }
}

connectToDB();

const app = express();
app.use(express.json());

const allowCrossDomain = function (req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

app.get('/', async (req, res) => {
    res.status(200).send('Hello, Express');
});

app.post('/todos', async (req, res) => {
    const { id, title } = req.body;

    const todoId = id ?? v4();

    try {
        const query = {
            text: 'INSERT INTO todos(id, title) VALUES($1, $2)',
            values: [todoId, title],
        };

        await pool.query(query);

        res.status(200).send({ id: todoId });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.use(
    postgraphile(
        process.env.DATABASE_URL || "postgres://postgres:password@db:5432/db_name",
        "public",
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
        }
    )
);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
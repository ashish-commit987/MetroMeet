import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express, { json } from 'express';
import chalk from 'chalk';
import { indexRoute } from './api/v1/routes/index.js';
import { Error404 } from './utils/middlewares/404.js';
import cors from 'cors';
import { CreateConnection } from './utils/db/connection.js';
import { startCleanupScheduler } from './cleanup-scheduler.js'; 

const app = express();

app.use(cors({
  origin: [
    'https://metro-meet.netlify.app', // Remove trailing slash for exact match
    'http://localhost:5173', 
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api/v1', indexRoute);
app.use(Error404);

const promise = CreateConnection();
promise.then(() => {
    const port = process.env.PORT || 7777;
    const server = app.listen(port, '0.0.0.0', (err) => {
        if (err) {
            console.log(chalk.redBright.italic('Server crash '), err);
        } else {
            console.log(chalk.greenBright.bold('Server Up and Running...'), server.address().port);
            startCleanupScheduler(); 
        }
    });
}).catch(err => {
    console.log(chalk.redBright.bold('DB crash... '), err);
});

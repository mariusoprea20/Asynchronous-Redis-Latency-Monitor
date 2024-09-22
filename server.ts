import express, { Request, Response, NextFunction } from 'express';
import cors from "cors";
import helmet from "helmet";
import tooBusy from "toobusy-js";
import { errorHandler } from './middleware/errorHandler';
import {runRedisClients} from "./controller/latencyTest";

const server = express();
const PORT = process.env.PORT || 3044;

server.use(helmet());
server.use(cors());

runRedisClients();

server.use(function (req: Request, res: Response, next: NextFunction) {
    if (tooBusy()) {
        res.status(503).json({ "message": "Server too busy" });
    } else {
        next();
    }
});
server.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`))
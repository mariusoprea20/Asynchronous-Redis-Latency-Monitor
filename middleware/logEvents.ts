import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";


export async function logEvents(message: string, logName: string) {
    const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;
    try {
        //if there is no directory create a directory
        //else append to the existing directory
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem)
    } catch (err) {
        console.log(err);
    }
}

export function logger(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    if (typeof origin === "string") {
        logEvents(`${req.method}\t${origin}\t${req.url}`, "reqLog.txt");
    } else {
        logEvents(`${req.method}\tNo Origin\t${req.url}`, "reqLog.txt");
    }
}
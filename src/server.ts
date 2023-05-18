import {config} from "./config/config";
import mongoose from "mongoose";
import express from "express";
import * as http from "http";
import scheduleDatabaseSave from "./service/ScheduledDatabaseSave";

const router = express();

mongoose.connect(config.mongo.url, {retryWrites: true, w: 'majority'})
    .then(() => {
        console.info('Connected to MongoDB');
        StartServer();
        scheduleDatabaseSave();
    })
    .catch((error) => {
        console.error('Unable to connect to MongoDB');
        console.error(error);
    });

function StartServer() {

    router.use((req, res, next) => {
        console.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req
            .socket.remoteAddress}]`);
        res.on('finish', () => {
            console.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req
                .socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({extended: true}));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });


    router.get('/ping', (req, res, next) =>
        res.status(200).json({message: 'pong'}));
    router.use((req, res, next) => {
        const error = new Error('Not Found');
        console.error(error);
        return res.status(404).json({message: error.message});
    });

    http.createServer(router)
        .listen(config.server.port, () =>
            console.info(`Server is running on port ${config.server.port}`));

}

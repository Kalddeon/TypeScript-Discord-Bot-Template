import mongoose from 'mongoose';
import mysql from 'mysql';
import { bot } from '../Client/Client';
import { config } from '../config';

class DatabaseConnect{
    public static init() {
        if(config.sql) {
            var pool = mysql.createPool({
                host: config.dbHost,
                port: config.dbPort,
                user: config.dbUsername,
                password: config.dbPassword,
                database: config.dbName
            });

            pool.getConnection(function(err: any, conn: any) {
                if(err) {
                    bot.logger.error(`Connection Error : \n ${err}`);
                    return;
                }
                bot.logger.success(`Successfully connected to ${config.dbHost}:${config.dbName}`);
            });
        }
        else if(config.mongo) {
            mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority`);

            mongoose.connection.on('connected', () => {
                bot.logger.success(`Successfully connected to MongoDB`);
            })

            mongoose.connection.on('err', (err) => {
                bot.logger.error(`Connection Error : \n ${err}`);
            })

            mongoose.connection.on('disconnected', () => {
                bot.logger.log(`Disconnected from MongoDB`);
            })
        }
    }
}

export { DatabaseConnect };

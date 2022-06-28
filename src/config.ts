import { IConfig } from "./Interfaces/Config"

// Config
class Config implements IConfig {
    private _mongo: boolean | undefined;
    private _sql: boolean | undefined;
    private _token: string | undefined;
    private _dbPassword: string | undefined;
    private _dbUsername: string | undefined;
    private _dbName: string | undefined;
    private _dbHost: string | undefined;
    private _dbPort: number | undefined;

    public get dbPort(): number | undefined {
        return this._dbPort;
    }
    public set dbPort(value: number | undefined) {
        this._dbPort = value;
    }

    public get dbHost(): string | undefined {
        return this._dbHost;
    }
    public set dbHost(value: string | undefined) {
        this._dbHost = value;
    }

    public get mongo(): boolean | undefined {
        return this._mongo;
    }
    public set mongo(value: boolean | undefined) {
        this._mongo = value;
    }

    public get sql(): boolean | undefined {
        return this._sql;
    }
    public set sql(value: boolean | undefined) {
        this._sql = value;
    }

    public get dbUsername(): string | undefined {
        return this._dbUsername;
    }
    public set dbUsername(value: string | undefined) {
        this._dbUsername = value;
    }

    public get dbPassword(): string | undefined {
        return this._dbPassword;
    }
    public set dbPassword(value: string | undefined) {
        this._dbPassword = value;
    }

    public get token(): string | undefined {
        return this._token;
    }
    public set token(value: string | undefined) {
        this._token = value;
    }

    public get dbName(): string | undefined {
        return this._dbName;
    }
    public set dbName(value: string | undefined) {
        this._dbName = value;
    }
};

const config = new Config();
config.sql = JSON.parse(process.env.sql);
config.mongo = JSON.parse(process.env.mongo);
config.token = process.env.BOTTOKEN;
config.dbUsername = process.env.dbUsername;
config.dbPassword =process.env.dbPassword;
config.dbName = process.env.dbName;
config.dbHost = process.env.dbHost;
config.dbPort = parseInt(process.env.dbPort);

export { config };

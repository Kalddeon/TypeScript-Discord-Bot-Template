import { Bot } from "../Client/Client"

export interface Run {
    (client: Bot, ...args: any[]): Promise<void | any>;
}

export interface Event {
    name: string;
    once?: boolean;
    run: Run;
}
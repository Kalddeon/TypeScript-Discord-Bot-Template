import { Bot } from "../Client/Client"
import { ButtonInteraction, PermissionResolvable } from "discord.js"

export interface Execute {
    (client: Bot, interaction: ButtonInteraction, ...args: any[]): Promise<void | any>;
}

export interface Properties {
    id: string;
    description: string;
    owner: boolean;
    onlyAuthor: boolean;
    permissions: PermissionResolvable[];
    ephemeral?: boolean;
}

export interface Button {
    properties: Properties;
    execute: Execute;
}

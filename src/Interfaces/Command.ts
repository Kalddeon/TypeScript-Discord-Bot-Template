import { Bot } from "../Client/Client"
import { CommandInteraction, ContextMenuInteraction, PermissionResolvable } from "discord.js"
import { ApplicationCommandOptionType } from "discord-api-types/v10";

export interface RunSlashCommand {
    (client: Bot, interaction: CommandInteraction | ContextMenuInteraction, ...args: any[]): Promise<void | any>;
}

interface Choice {
    name: string;
    value: string | number | boolean;
}

export interface Options {
    name: string;
    type: ApplicationCommandOptionType;
    description: string;
    required?: boolean;
    choices?: Choice[];
}

export interface Properties {
    name: string;
    category: string;
    owner: boolean;
    description: string;
    ephemeral: boolean;
    timeout: number;
    type?: number;
    permissions?: PermissionResolvable[];
    options: Options[];
}

export interface Command {
    properties: Properties;
    runSlashCommand?: RunSlashCommand;
}

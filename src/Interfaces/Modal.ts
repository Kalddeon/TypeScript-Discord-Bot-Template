import { Bot } from "../Client/Client"
import { ModalSubmitInteraction } from "discord.js"

export interface Submit {
    (client: Bot, interaction: ModalSubmitInteraction, ...args: any[]): Promise<void | any >;
}

export interface Properties {
    name: string;
    ephemeral?: boolean;
}

export interface Modal {
    properties: Properties;
    submit: Submit;
}

import { Message } from 'discord.js';
import { Bot } from '../../Client/Client';
import { Run } from "../../Interfaces/Event";

/**
 * 
 * @param {Bot} client 
 * @param {Message} message 
 * @returns 
 */
export const run: Run = async(client, message: Message) => {
    if (message.author.bot || !message.guild) return;
    // CODE
    return;
}

export const name: string = 'messageCreate';
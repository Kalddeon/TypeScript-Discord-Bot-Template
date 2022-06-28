import { Guild } from 'discord.js';
import { Bot } from '../../Client/Client';
import { Run } from "../../Interfaces/Event";

/**
 * 
 * @param {Bot} client 
 * @param {Guild} guild 
 * @returns 
 */
export const run: Run = async(client: Bot, guild: Guild) => {
   client.logger.success(`Successfully joined ${guild.name}`);
   return;
}

export const name: string = 'guildCreate';
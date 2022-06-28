import { CommandInteraction, Message } from 'discord.js';
import { Bot } from '../../Client/Client';
import DiscordEmbed from '../../Helpers/DiscordEmbed';
import { Command } from '../../Interfaces/Command';
import { Run } from "../../Interfaces/Event";

export const run: Run = async(client: Bot, message: Message | CommandInteraction, command: Command) => {
    client.logger.warn(`${message.member?.user.username}#${message.member?.user.discriminator} tried to access the following admin command: ${command.properties.name}`)
    const embed = new DiscordEmbed(message, command.properties.ephemeral)
    .setTitle('❌ Accès refusé:')
    .setDescription('Vous ne possédez pas les permissions nécessaires pour effectuer cette commande');
    await embed.reply();
    return;
}

export const name: string = 'missing-permissions-command';
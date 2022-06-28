import { ButtonInteraction } from 'discord.js';
import { Bot } from '../../Client/Client';
import DiscordEmbed from '../../Helpers/DiscordEmbed';
import { Button } from '../../Interfaces/Button';
import { Run } from "../../Interfaces/Event";

export const run: Run = async(client: Bot, message: ButtonInteraction, button: Button) => {
    client.logger.warn(`${message.member?.user.username}#${message.member?.user.discriminator} tried to access the following admin button: ${button.properties.id}`)
    const embed = new DiscordEmbed(message, button.properties.ephemeral)
    .setTitle('❌ Accès refusé:')
    .setDescription('Vous ne possédez pas les permissions nécessaires pour exécuter ce bouton');
    await embed.reply();
    return;
}

export const name: string = 'missing-permissions-button';
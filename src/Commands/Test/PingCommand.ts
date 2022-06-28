import { CommandInteraction } from "discord.js";
import DiscordEmbed from "../../Helpers/DiscordEmbed";
import { Properties, RunSlashCommand } from "../../Interfaces/Command";

export const runSlashCommand: RunSlashCommand = async(client, interaction: CommandInteraction, args) => {
    var ping = Date.now() - interaction.createdTimestamp
    var embed = new DiscordEmbed(interaction, properties.ephemeral);
    await embed.reply(`Pong 🏓\n\nLatence: ${ping}ms\nAPI: ${client.ws.ping}ms`);
}

export const properties: Properties = {
    name: 'ping',
    category: 'basic',
    permissions: [],
    owner: false,
    description: 'Afficher le ping du bot',
    ephemeral: false,
    timeout: 0,
    options: []
};
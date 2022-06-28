import { MessageActionRow, MessageButton } from "discord.js";
import DiscordEmbed from "../../Helpers/DiscordEmbed";
import { Button } from "../../Interfaces/Button";
import { Properties, RunSlashCommand } from "../../Interfaces/Command";

export const runSlashCommand: RunSlashCommand = async(client, interaction, args) => {
    const testButton: Button = await client.getButton('testbutton');
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(testButton.properties.id)
                .setLabel('Click Me!')
                .setStyle('PRIMARY'),
        );
    const embed: DiscordEmbed = new DiscordEmbed(interaction, properties.ephemeral);
    return await embed.reply(`Test Bouton`, `Cliquez sur le bouton!`, {components: [row]});
}

export const properties: Properties = {
    name: 'test-button',
    category: 'owner',
    permissions: ['ADMINISTRATOR'],
    owner: true,
    description: 'Test Button',
    ephemeral: false,
    timeout: 0,
    options: []
};
import { ModalSubmitInteraction } from "discord.js";
import DiscordEmbed from "../../Helpers/DiscordEmbed";
import { Properties, Submit } from "../../Interfaces/Modal";


export const submit: Submit = async(client, interaction: ModalSubmitInteraction, args) => {
    const firstname = interaction.fields.getTextInputValue('firstnameInput');
    const lastname = interaction.fields.getTextInputValue('lastnameInput');
    const embed = new DiscordEmbed(interaction, properties.ephemeral)
    .setTitle("✅ | Formulaire complété!")
    .addField('Prénom', firstname)
    .addField('Nom', lastname)
    await embed.reply();
    return;
}

export const properties: Properties = {
    name: "testModal",
    ephemeral: true
};
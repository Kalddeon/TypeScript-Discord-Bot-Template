import { ButtonInteraction, MessageActionRow, Modal, TextInputComponent } from "discord.js";
import { Properties, Execute } from "../../Interfaces/Button";


export const execute: Execute = async(client, interaction: ButtonInteraction, args) => {
    const modal = new Modal()
        .setCustomId('testModal')
        .setTitle('Informations')

    const firstRow: MessageActionRow<TextInputComponent> = new MessageActionRow<TextInputComponent>()
    .addComponents(
        new TextInputComponent()
        .setCustomId('firstnameInput')
        .setLabel("Prénom")
        .setPlaceholder("John")
        .setMinLength(1)
        .setMaxLength(20)
        .setStyle('SHORT'),
    )

    const secondRow: MessageActionRow<TextInputComponent> = new MessageActionRow<TextInputComponent>()
    .addComponents(
        new TextInputComponent()
        .setCustomId('lastnameInput')
        .setLabel("Nom")
        .setPlaceholder("Smith")
        .setMinLength(1)
        .setMaxLength(20)
        .setStyle('SHORT'),
    )

    modal.addComponents(firstRow, secondRow);
    await interaction.showModal(modal);
    return;
}

export const properties: Properties = {
    id: "testbutton",
    description: "Bouton Test Modal",
    ephemeral: true,
    permissions: [],
    owner: true,
    onlyAuthor: true
};
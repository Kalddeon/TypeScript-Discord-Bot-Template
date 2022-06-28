import { ButtonInteraction, Message } from 'discord.js';
import { Bot } from '../../Client/Client';
import DiscordEmbed from '../../Helpers/DiscordEmbed';
import { Button } from '../../Interfaces/Button';
import { Run } from "../../Interfaces/Event";

/**
 * 
 * @param { Bot } client 
 * @param { ButtonInteraction } interaction 
 * @returns 
 */
export const run: Run = async(client: Bot, interaction: ButtonInteraction) => {
    if(!interaction.isButton()) return;
    else{
        const interactionMessage = await interaction.channel.messages.fetch(interaction.message.id, {cache: false});
        var interactionReferenceMessage: Message<boolean>;
        if(interactionMessage.reference) interactionReferenceMessage = await interaction.channel.messages.fetch(interactionMessage.reference.messageId, {cache: false});
        const button: Button = await client.getButton(interaction.customId);
        if(button && button.execute){
            client.logger.info(`Button ${button.properties.id} clicked!`);
            if(button.properties.owner == true && !client.isOwner(interaction.member?.user.id!)) return await client.runEvent('missing-permissions-button', interaction, button);
            if(button.properties.permissions && !interaction.memberPermissions.has(button.properties.permissions)) return await client.runEvent('missing-permissions-button', interaction, button);
            if(button.properties.onlyAuthor) {
                if(interactionReferenceMessage && interactionReferenceMessage.author.id != interaction.member.user.id) {
                    await new DiscordEmbed(interaction, true).replyError("❌ Vous n'êtes pas l'auteur de cette interaction!");
                    return;
                }
                else if(interactionMessage.interaction.user.id != interaction.member.user.id) {
                    await new DiscordEmbed(interaction, true).replyError("❌ Vous n'êtes pas l'auteur de cette interaction!");
                    return;
                }
                else{
                    client.logger.info(`Executing Button...`);
                    await button.execute(client, interaction).catch(async (reason: any) => {
                        client.logger.error(`${button.properties.id} execution failed!\n${reason}`);
                        await new DiscordEmbed(interaction, true).replyError();
                    });
                    return;
                }
            }
            else{
                client.logger.info(`Executing Button...`);
                await button.execute(client, interaction).catch(async (reason: any) => {
                    client.logger.error(`${button.properties.id} execution failed!\n${reason}`);
                    await new DiscordEmbed(interaction, true).replyError();
                })
                return;
            }
        }
    }
}

export const name: string = 'interactionCreate';
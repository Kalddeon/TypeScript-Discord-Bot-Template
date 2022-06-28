import { ModalSubmitInteraction } from 'discord.js';
import { Bot } from '../../Client/Client';
import DiscordEmbed from '../../Helpers/DiscordEmbed';
import { Run } from "../../Interfaces/Event";
import { Modal } from '../../Interfaces/Modal';

/**
 * 
 * @param { Bot } client 
 * @param { ModalSubmitInteraction } interaction 
 * @returns
 */
export const run: Run = async(client: Bot, interaction: ModalSubmitInteraction ) => {
    if(!interaction.isModalSubmit()) return;
    else{
        const modal: Modal = await client.getModal(interaction.customId);
        if(modal && modal.submit){
            client.logger.info(`Modal ${modal.properties.name} submitted!`);
            await modal.submit(client, interaction).catch(async (reason: any) => {
                client.logger.error(`${modal.properties.name} submission failed!\n${reason}`);
                await new DiscordEmbed(interaction, true).replyError();
                await client.runEvent('modal-submit-error', interaction, await client.getModal(modal.properties.name), reason);
                return;
            })
        }
        else {
            await new DiscordEmbed(interaction, true).replyError();
            return;
        }
    }
}

export const name: string = 'interactionCreate';
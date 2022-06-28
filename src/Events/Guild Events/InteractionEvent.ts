import DiscordEmbed from '../../Helpers/DiscordEmbed';
import { Command } from '../../Interfaces/Command';
import { Run } from "../../Interfaces/Event";

/**
 * 
 * @param { Bot } client 
 * @param { CommandInteraction } interaction 
 * @returns 
 */
export const run: Run = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()){
        const options = interaction.options;
        var args: (string | number | boolean)[] | void[];
        let subCommandGroup = await interaction.options.getSubcommandGroup(false);
        let subCommand = await interaction.options.getSubcommand(false);
        if(subCommand !== null && subCommandGroup === null) {
            args = options.data[0]?.options?.map(option => {
                return option.value;
            });
            interaction.commandName = `${interaction.commandName} ${subCommand}`;
        } 
        else if(subCommand !== null && subCommandGroup !== null) {
            args = options.data[0]?.options?.at(0)?.options?.map(option => {
                return option.value;
            })
            interaction.commandName = `${interaction.commandName} ${subCommandGroup} ${subCommand}`;
        }
        else {
            args = options.data.map(option => {
                return option.value;
            });
        }
    
        const command: Command | undefined = await client.getCommand(interaction.commandName);
        if(!command){
            client.logger.warn('No command provided!');
            return;
        }
        else{
            client.logger.info(`${interaction.commandName} command provided`);
            if(command.properties.owner == true && !client.isOwner(interaction.member?.user.id!)) return await client.runEvent('missing-permissions-command', interaction, command);
            if(command.properties.permissions && !interaction.memberPermissions.has(command.properties.permissions)) return await client.runEvent('missing-permissions-command', interaction, command);
            return await command.runSlashCommand(client, interaction, args).catch(async (reason: any) => {
                client.logger.error(`${command.properties.name} failed!\n${reason}`);
                await new DiscordEmbed(interaction, true).replyError();
                return;
            })
        }
    }
}

export const name: string = 'interactionCreate';
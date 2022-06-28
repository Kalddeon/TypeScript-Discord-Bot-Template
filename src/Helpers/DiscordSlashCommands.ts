import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";
import { Command } from "../Interfaces/Command";

type ChannelType = {
    id: number;
    description: string;
}

interface choices {
    name: string;
    value: string | number | boolean;
}

interface CommandOptions {
    type: number;
    name: string;
    description: string;
    required?: boolean;
    choices?: Array<choices>;
    options?: Array<CommandOptions>;
    channel_types?: Array<ChannelType>;
    min_value?: number;
    max_value?: number;
    autocomplete?: boolean;
}

interface SubCommand {
    description: string;
    name: string;
    type: ApplicationCommandOptionType.Subcommand;
    options: Array<CommandOptions>;
}

interface SlashCommand {
    defaultPermission?: undefined | boolean;
    description?: string;
    name: string;
    type?: ApplicationCommandType;
    options: Array<CommandOptions>;
}

export default class DiscordSlashCommandsBuilder implements SlashCommand {
    defaultPermission?: boolean | undefined;
    type?: ApplicationCommandType;
    description?: string;
    name: string;
    options: CommandOptions[] = [];
    constructor() {}

    /**
     * setName
     */
    public setName(name: string) {
        this.name = name
        return this;
    }

    /**
     * setDescription
     */
    public setDescription(description: string) {
        this.description = description;
        return this;
    }

    /**
     * setDescription
     */
     public setType(type: ApplicationCommandType) {
        this.type = type;
        return this;
    }

    /**
     * addOption
     */
    public addOption(option: CommandOptions | SubCommand) {
        var found = this.options.findIndex(opt => opt.name === option.name)
        if(found != -1) {
            this.options.at(found)?.options?.push(option.options?.at(0)!);
        }
        else{
            this.options.push(option);
        }
        return this;
    }

    /**
     * getSubCommands
     */
    public getSubCommands() {
        return this.options;
    }

    /**
     * createSlashCommand
     */
    public static createSlashCommand(command: Command) {
        const commandNames: string[] = command.properties.name.split(' ');
        var data: DiscordSlashCommandsBuilder = new DiscordSlashCommandsBuilder();
        if(commandNames.length === 1){
            data.setName(commandNames[0])
            if(command.properties.type !== ApplicationCommandType.User) data.setDescription(command.properties.description);
            else data.setType(ApplicationCommandType.User);
            command.properties.options.forEach(option => {
                data.addOption({
                    name: option.name,
                    type: option.type,
                    description: option.description,
                    required: option.required,
                    choices: option.choices
                })
            })
        }
        else if(commandNames.length === 2){
            var subCommand: SubCommand = {
                name: commandNames[1],
                description: command.properties.description,
                type: ApplicationCommandOptionType.Subcommand,
                options: []
            }
            command.properties.options.forEach(option => {
                subCommand.options.push({
                    name: option.name,
                    type: option.type,
                    description: option.description,
                    required: option.required,
                    choices: option.choices
                })
            })
            data.setName(commandNames[0])
            .setDescription(`Commande ${commandNames[0]}`)
            .addOption(subCommand);
        }
        else if(commandNames.length === 3){
            var subCommandGroup: SubCommand = {
                name: commandNames[1],
                description: `Groupe de commandes: ${commandNames[1]}`,
                type: 2,
                options: []
            }
            var subCommand: SubCommand = {
                name: commandNames[2],
                description: command.properties.description,
                type: 1,
                options: []
            }
            subCommandGroup.options.push(subCommand);
            command.properties.options.forEach(option => {
                subCommand.options.push({
                    name: option.name,
                    type: option.type,
                    description: option.description,
                    required: option.required,
                    choices: option.choices
                })
            })
            data.setName(commandNames[0])
            .setDescription(`Commande ${commandNames[0]}`)
            .addOption(subCommandGroup);
        }
        return data;
    }
}

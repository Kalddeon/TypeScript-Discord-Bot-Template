import { ButtonInteraction, Interaction, Message } from "discord.js";
import { Collection } from "discord.js";
import { MessageComponentTypes } from "discord.js/typings/enums";

export default class DiscordInteractions {
    private _interaction: Interaction;

    public get interaction(): Interaction {
        return this._interaction;
    }
    public set interaction(value: Interaction) {
        this._interaction = value;
    }

    /**
     * 
     * @param {Interaction} interaction 
     */
    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    /**
     * collect one Message
     * @param {number} time
     * @returns {Promise<Message<boolean>>}
     */
    public async collectOneMessage(time: number): Promise<Message<boolean>> {
        const messages = await this.interaction.channel.awaitMessages({
            filter: m => m.author.id === this.interaction.user.id,
            max: 1,
            time: time*1000,
            errors: ['time'],
        });
        return messages.first();
    }

    /**
     * create component Collector
     * @param {number} time
     * @param {Message<boolean>} message
     * @param {MessageComponentTypes} componentType?
     */
    public async createComponentCollector({ time, message, componentType }: { time: number; message: Message<boolean>; componentType?: MessageComponentTypes}) {
        const filter = async (i: ButtonInteraction) => {
            await i.deferUpdate();
            return i.user.id === this.interaction.user.id;
        }
        const messageComponentCollector = message.createMessageComponentCollector({
            filter: filter,
            time: time*1000,
            componentType: componentType
        });
        return messageComponentCollector;
    }

    /**
     * create component Collector
     * @param {number} time
     * @param {Message<boolean>} message
     * @param {MessageComponentTypes} componentType?
     */
     public async getComponentResponse({ time, message, componentType }: { time: number; message: Message<boolean>; componentType?: MessageComponentTypes}): Promise<string> {
        const filter = async (i: ButtonInteraction) => {
            await i.deferUpdate();
            return i.user.id === this.interaction.user.id;
        }

        const response = await message.awaitMessageComponent({
            filter: filter,
            time: time*1000,
            componentType: componentType
        });
        
        return response.customId;
    }

    /**
     * collect Messages
     * @param {number} time
     * @param {number} max
     * @returns {Promise<Collection<string, Message<boolean>>>}
     */
    public async collectMessages(time: number, max: number): Promise<Collection<string, Message<boolean>>> {
        const messages = await this.interaction.channel.awaitMessages({
            filter: m => m.author.id === this.interaction.user.id,
            max: max,
            time: time*1000,
            errors: ['time'],
        });
        return messages;
    }
}
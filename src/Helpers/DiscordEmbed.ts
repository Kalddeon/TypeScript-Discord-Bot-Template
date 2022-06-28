import { APIEmbed } from 'discord-api-types/v10';
import {ButtonInteraction, CommandInteraction, ContextMenuInteraction, EmbedField, Message, MessageActionRow, MessageActionRowComponentResolvable, MessageEmbed, MessageResolvable, ModalSubmitInteraction } from 'discord.js'
import { bot } from '../Client/Client';

export default class DiscordEmbed extends MessageEmbed {
    private _guildId: string;
    private _ephemeral: boolean;
    private _components: MessageActionRow[];
    private _message: Message | CommandInteraction | ContextMenuInteraction | ButtonInteraction | ModalSubmitInteraction;

    public get message(): Message | CommandInteraction | ContextMenuInteraction | ButtonInteraction | ModalSubmitInteraction {
        return this._message;
    }
    public set message(value: Message | CommandInteraction | ContextMenuInteraction | ButtonInteraction | ModalSubmitInteraction) {
        this._message = value;
    }

    public get components(): MessageActionRow[] {
        return this._components;
    }
    public set components(value: MessageActionRow[]) {
        this._components = value;
    }

    public get ephemeral(): boolean {
        return this._ephemeral;
    }
    public set ephemeral(value: boolean) {
        this._ephemeral = value;
    }

    public get guildId(): string {
        return this._guildId;
    }
    public set guildId(value: string) {
        this._guildId = value;
    }

    constructor(message: Message | CommandInteraction | ContextMenuInteraction | ButtonInteraction | ModalSubmitInteraction, ephemeral: boolean, {embed, components}: {embed?: MessageEmbed | APIEmbed, components?: MessageActionRow[]} = {}) {
        super();
        if(embed) {
            this.title = embed.title;
            this.description = embed.description;
            this.author = embed.author;
            this.image = embed.image;
            this.fields = embed.fields as EmbedField[];
            this.thumbnail = embed.thumbnail;
            this.color = embed.color;
            this.footer = embed.footer;
            this.url = embed.url;            
        }
        if(components) this.components = components;
        this._guildId = message.guildId!;
        this._message = message;
        this._ephemeral = ephemeral;
        this.setFooter({ text: bot.getUsername()!, iconURL: bot.getAvatarURL()! });
        if(message instanceof Message) this.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL()!})
        else if(message instanceof CommandInteraction) this.setAuthor({ name: message.user.username!, iconURL: message.user.avatarURL()!})
        this.setColor('#911f21')
    }

    /**
     * getComponents
     * @param {number} atIndex?
     */
    public getComponents({ atIndex }: { atIndex?: number; } = {}) {
        if(atIndex != undefined) {
            return this.components[atIndex];
        }
        else{
            return this.components
        }
    }

    /**
     * getComponent
     * @param {string} id
     */
    public getComponent({id}: {id: string}) {
        const row = this.components.find(row => row.components.some(c => c.customId === id));
        if(row) {
            const component = row.components.filter(c => c.customId === id).at(0);
            return component;
        }
        else return;
    }

    /**
     * setComponents
     * @param {MessageActionRow[]} components
     */
    public setComponents(components: MessageActionRow[]) {
        this.components = components;
    }

    /**
     * clearComponents
     */
     public clearComponents() {
        this.components = [];
    }

    public async updateEmbed() {
        if(this.message instanceof Message){
            return await this.message.reply({embeds: [this], components: this.components})
        }
        else {
            if(this.message.replied || this.message.deferred) return await this.message.editReply({embeds: [this], components: this.components});
        }
    }

    /**
     * getComponent
     * @param {string} id
     * @param {MessageActionRowComponentResolvable} component
     */
     public async updateComponent({id, component}: {id: string, component: MessageActionRowComponentResolvable}): Promise<void> {
        var row = this.components.find(row => row.components.some(c => c.customId === id));
        if(row) {
            var rowIndex = this.components.findIndex(row => row.components.some(c => c.customId === id));
            var componentIndex = row.components.findIndex(c => c.customId === id)
            row.spliceComponents(componentIndex, 1);
            row.addComponents(component)
            this.components[rowIndex] = row;
            await this.updateEmbed();
        }
    }

    /**
     * reply
     */
    public async reply(title?: string, content?: string, {components}: {components?: MessageActionRow[]} = {}) {
        if(components) this.components = components;
        if(title) this.title = title;
        if(content) this.description = content;
        if(this.message instanceof Message){
            return await this.message.reply({embeds: [this], components: this.components})
        }
        else {
            if(this.message.replied || this.message.deferred) return await this.message.editReply({embeds: [this], components: this.components});
            return await this.message.reply({embeds: [this], ephemeral: this.ephemeral, components: this.components, fetchReply: true});
        }
    }

    /**
     * replyError
     */
     public async replyError(title?: string, err?: string) {
        if(title) this.title = title;
        else this.title = "❌ Une erreur s'est produite!";
        if(err) this.description = `Raison: \`\`\`${err}\`\`\``;
        if(this.message instanceof Message){
            return await this.message.reply({embeds: [this], components: this.components})
        }
        else {
            if(this.message.replied || this.message.deferred) return await this.message.editReply({embeds: [this], components: this.components});
            return await this.message.reply({embeds: [this], ephemeral: this.ephemeral, components: this.components, fetchReply: true});
        }
    }

    /**
     * send
     */
    public async send(title?: string, content?: string) {
        if(title) this.title = title;
        if(content) this.description = content;
        if(this.message instanceof Message){
            return await this.message.channel.send({embeds: [this], components: this.components})
        }
        else {
            return await this.message.followUp({embeds: [this], ephemeral: this.ephemeral, components: this.components});
        }
    }
}
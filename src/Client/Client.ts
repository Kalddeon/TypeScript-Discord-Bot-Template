// Imports
import { ButtonInteraction, Client, Collection, CommandInteraction, Intents, ModalSubmitInteraction } from "discord.js";
import consola, { Consola } from "consola";
import { config } from '../config';
import glob from 'glob';
import { promisify } from "util";
import { Command } from "../Interfaces/Command";
import { Event } from "../Interfaces/Event";
import { Routes } from 'discord-api-types/v9'
import { REST } from "@discordjs/rest";
import cliProgress from 'cli-progress';
import DiscordSlashCommandsBuilder from "../Helpers/DiscordSlashCommands";
import { Button } from "../Interfaces/Button";
import { Modal } from "../Interfaces/Modal";
const globPromise = promisify(glob);
const token = config.token;

// Bot
class Bot extends Client {
    private restRequest = new REST({ version: '9' }).setToken(process.env.BOTTOKEN!);
    public logger: Consola = consola;
    public started: boolean = false;
    public commands: Collection<string, Command> = new Collection();
    public modals: Collection<string, Modal> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public customEmojis: any = {};

    constructor() {
        super({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_VOICE_STATES]});
    }

     /**
     * Start
     */
    public async Start(): Promise<void> {
        if(this.started == false) {
            this.logger.success(`Bot started`)
            this.login(token);
            this.started = true;
            const commandsFiles: string[] = await globPromise(`${__dirname}/../Commands/**/*{.ts,.js}`);
            const eventsFiles: string[] = await globPromise(`${__dirname}/../Events/**/*{.ts,.js}`);
            const buttonsFiles: string[] = await globPromise(`${__dirname}/../Buttons/**/*{.ts,.js}`);
            const modalsFiles: string[] = await globPromise(`${__dirname}/../Modals/**/*{.ts,.js}`);
            const loadingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            this.logger.info('Mapping events, commands and buttons...');
            loadingBar.start(eventsFiles.length+commandsFiles.length+buttonsFiles.length+modalsFiles.length, 0);

            commandsFiles.map(async(value: string) => {
                const file: Command = await import(value);
                this.commands.set(file.properties.name, file);
                loadingBar.increment(1);
            })

            modalsFiles.map(async(value: string) => {
                const file: Modal = await import(value);
                this.modals.set(file.properties.name, file);
                loadingBar.increment(1);
            })

            buttonsFiles.map(async(value: string) => {
                const file: Button = await import(value);
                this.buttons.set(file.properties.id, file);
                loadingBar.increment(1);
            })

            eventsFiles.map(async(value: string) => {
                const event: Event = await import(value);
                this.events.set(event.name, event);
                if(event.once === true) {
                    this.once(event.name, (...args) => event.run(this, ...args));
                }
                else{
                    this.on(event.name, (...args) => event.run(this, ...args));
                }
                loadingBar.increment(1);
            })
        }
        else {
            this.logger.error(`The bot is already running..`);
        }
    }

     /**
     * Stop
     */
    public Stop(): void {
        if(this.started == true){
            this.logger.success(`Bot stopped`)
            this.started = false;
            this.destroy();
        }
        else{
            this.logger.error(`Nothing is running..`)
        }
    }

    /**
    * isOwner
    */
    public isOwner(memberID: string ) {
        return memberID == '846431356896673834' || memberID == '198414910391189516';
    }

     /**
     * getIdentifier
     */
    public getIdentifier(): string | undefined {
        return this.user?.id
    }

     /**
     * getAvatarURL
     */
    public getAvatarURL(): string | null | undefined {
        return this.user?.avatarURL();
    }

     /**
     * getDiscriminator
     */
    public getDiscriminator(): string | undefined {
        return this.user?.discriminator;
    }

     /**
     * getUsername
     */
    public getUsername(): string | undefined {
        return this.user?.username;
    }

     /**
     * getTag
     */
    public getTag(): string | undefined {
        return this.user?.tag;
    }

     /**
     * isVerified
     */
    public isVerified(): boolean | undefined {
        return this.user?.verified;
    }

    /**
     * getCommands
     */
    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    /**
     * getButtons
     */
    public getButtons(): Collection<string, Button> {
        return this.buttons;
    }

    /**
     * getModals
     */
    public getModals(): Collection<string, Modal> {
        return this.modals;
    }

    /**
     * getEvents
     */
    public getEvents(): Collection<string, Event> {
        return this.events;
    }

    /**
     * getCommand
     */
    public async getCommand(commandName: string): Promise<Command> {
        return this.commands.get(commandName);
    }

    /**
     * runSlashCommand
     */
     public async runSlashCommand(commandName: string, interaction: CommandInteraction, ...args: any[]): Promise<void> {
        this.commands.get(commandName)?.runSlashCommand!(this, interaction, ...args);
    }

    /**
     * getEvent
     */
    public async getEvent(eventName: string): Promise<Event> {
        return this.events.get(eventName);
    }

    /**
     * runEvent
     */
    public async runEvent(eventName: string, ...args: any[]): Promise<void> {
        await this.events.get(eventName)?.run(this, ...args);
    }

    /**
     * getButton
     */
    public async getButton(buttonId: string): Promise<Button> {
        return this.buttons.get(buttonId);
    }

    /**
     * executeButton
     */
    public async executeButton(buttonId: string, interaction: ButtonInteraction, ...args: any[]): Promise<void> {
        await this.buttons.get(buttonId)?.execute(this, interaction, ...args)
    }

    /**
     * getModal
     */
    public async getModal(name: string): Promise<Modal> {
        return this.modals.get(name);
    }

    /**
     * submitModal
     */
    public async submitModal(name: string, interaction: ModalSubmitInteraction, ...args: any[]): Promise<void> {
        await this.modals.get(name)?.submit(this, interaction, ...args)
    }

   /**
    * deploySlashCommands
    */
    public async deploySlashCommands() {
        try {
            const DiscordSlashCommands: Array<DiscordSlashCommandsBuilder> = [];
            this.logger.info('Started refreshing application (/) commands.');
            this.commands.forEach(command => {
                var commandNames = command.properties.name.split(' ');
                var slashCommand: DiscordSlashCommandsBuilder = DiscordSlashCommandsBuilder.createSlashCommand(command)
                var found: DiscordSlashCommandsBuilder | undefined = DiscordSlashCommands.find(cmd => cmd.name === commandNames[0]);
                if(!found) {
                    DiscordSlashCommands.push(slashCommand);
                }
                else{
                    found.addOption(slashCommand.options.at(0)!)
                }
            })
            await this.restRequest.put(
                Routes.applicationCommands(this.getIdentifier()!),
                { 
                    body: DiscordSlashCommands
                },
            );
            this.logger.success('Successfully reloaded application (/) commands.');
        } catch (error) {
            this.logger.error(error);
        }
    }
}

const bot = new Bot();

// Exports
export { Bot, bot };
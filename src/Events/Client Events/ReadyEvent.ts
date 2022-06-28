import { Run } from "../../Interfaces/Event";

export const run: Run = async(client) => {
    client.logger.log('\n');
    client.deploySlashCommands().then(() => {
        client.logger.success(`${client.getTag()} is now ready in ${client.guilds.cache.size} guild(s)`);
    });
    
    client.user?.setPresence({ activities: [{ name: 'Activité?' , type: 'WATCHING'}] })
}

export const name: string = 'ready';
export const once: boolean = true;
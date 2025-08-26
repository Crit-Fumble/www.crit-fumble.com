import { Collection, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class CommandManager {
  constructor(client, logger) {
    this.client = client;
    this.logger = logger;
    this.commands = new Collection();
    this.commandFolders = ['general', 'admin', 'dev'];
  }

  async registerCommands() {
    try {
      // Get application commands
      const commands = [];
      
      // Process each command folder
      for (const folder of this.commandFolders) {
        const commandsPath = path.join(__dirname, '..', 'commands', folder);
        
        // Check if directory exists before proceeding
        if (!fs.existsSync(commandsPath)) {
          this.logger.info(`Command directory ${commandsPath} not found, creating it.`);
          fs.mkdirSync(commandsPath, { recursive: true });
          continue;
        }
        
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
          const filePath = path.join(commandsPath, file);
          try {
            const command = await import(`file://${filePath}`);
            
            // Set a new item in the Collection with the command name as the key
            if ('data' in command.default && 'execute' in command.default) {
              this.commands.set(command.default.data.name, command.default);
              commands.push(command.default.data.toJSON());
            } else {
              this.logger.warn(`The command at ${filePath} is missing required "data" or "execute" property.`);
            }
          } catch (error) {
            this.logger.error(`Error importing command from ${filePath}: ${error.message}`);
          }
        }
      }
      
      // Register commands with Discord API
      const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_PERSISTENT_BOT_TOKEN);
      
      this.logger.info(`Started refreshing ${commands.length} application commands.`);
      
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_PERSISTENT_BOT_APP_ID),
        { body: commands }
      );
      
      this.logger.info(`Successfully reloaded ${commands.length} application commands.`);
    } catch (error) {
      this.logger.error(`Error registering commands: ${error.message}`);
    }
  }

  async handleCommand(interaction) {
    const command = this.commands.get(interaction.commandName);
    
    if (!command) {
      this.logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
    
    try {
      await command.execute(interaction);
    } catch (error) {
      this.logger.error(`Error executing command ${interaction.commandName}: ${error.message}`);
      
      const reply = { content: 'There was an error executing this command!', ephemeral: true };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }
}

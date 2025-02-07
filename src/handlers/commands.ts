import { Telegraf } from 'telegraf';
import { BotContext } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export const commandHandler = async (bot: Telegraf<BotContext>) => {
  console.log('Loading commands...');
  
  const commandsPath = path.join(__dirname, 'commands');
  const commands = new Set<string>();
  
  // Read all files in the commands directory
  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => 
      file !== 'index.ts' && 
      !file.endsWith('.map') && 
      (file.endsWith('.ts') || file.endsWith('.js'))
    );

  // Load all commands in parallel
  await Promise.all(
    commandFiles.map(async (file) => {
      try {
        const commandName = path.parse(file).name;
        const modulePath = path.join(commandsPath, file);
        const module = await import(modulePath);
        const command = module[`${commandName}Command`];
        
        if (command) {
          bot.command(commandName, command);
          commands.add(commandName);
        } else {
          console.warn(`⚠️ Command not found in module: /${commandName}`);
        }
      } catch (err) {
        console.error(`❌ Error loading command ${file}:`, err);
      }
    })
  );
  
  // Log all loaded commands in one line
  if (commands.size > 0) {
    console.log(`✅ Loaded ${commands.size} commands: /${Array.from(commands).join(', /')}`);
  }
}; 
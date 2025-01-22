import { Telegraf } from 'telegraf';
import { BotContext } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export const messageHandler = async (bot: Telegraf<BotContext>) => {
  console.log('Loading message handlers...');
  
  const handlersPath = path.join(__dirname, 'messages');
  
  // Read all files in the messages directory
  const handlerFiles = fs.readdirSync(handlersPath)
    .filter(file => 
      file !== 'index.ts' && 
      !file.endsWith('.map') && 
      (file.endsWith('.ts') || file.endsWith('.js'))
    );

  // Load all handlers in parallel
  await Promise.all(
    handlerFiles.map(async (file) => {
      try {
        const handlerName = path.parse(file).name;
        const modulePath = path.join(handlersPath, file);
        const module = await import(modulePath);
        
        if (module.handler && module.type) {
          bot.on(module.type, module.handler);
          console.log(`✅ Loaded message handler: ${module.type}`);
        } else {
          console.warn(`⚠️ Invalid handler module: ${handlerName}`);
        }
      } catch (err) {
        console.error(`❌ Error loading handler ${file}:`, err);
      }
    })
  );
  
  console.log('All message handlers loaded!');
}; 
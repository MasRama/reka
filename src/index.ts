import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { commandHandler } from './handlers/commands';
import { messageHandler } from './handlers/messages';
import { setupMiddleware } from './middleware';
import { BotContext } from './types';

// Load environment variables
dotenv.config();

// Initialize bot with token
const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

// Setup middleware
setupMiddleware(bot);

// Setup command handlers
commandHandler(bot);

// Setup message handlers
messageHandler(bot);

// Error handling
bot.catch((err: any) => {
  console.error('Bot error:', err);
});

// Start the bot
bot.launch()
  .then(() => {
    console.log('Bot is running...');
  })
  .catch((err) => {
    console.error('Error starting bot:', err);
  });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 
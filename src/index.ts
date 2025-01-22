import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { commandHandler } from './handlers/commands';
import { messageHandler } from './handlers/messages';
import { setupMiddleware } from './middleware';
import { BotContext } from './types';

// Load environment variables
dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided in environment variables!');
}

// Initialize bot with token and development configuration
const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN, {
  handlerTimeout: 90000,
  telegram: {
    apiRoot: 'https://api.telegram.org',
    webhookReply: false,
    apiMode: 'bot'
  }
});

// Setup middleware
setupMiddleware(bot);

// Setup command handlers
commandHandler(bot);

// Setup message handlers
messageHandler(bot);

// Error handling with retry
bot.catch(async (err: any) => {
  const errorMessage = err.description || err.message || 'Unknown error';
  console.error('Bot error:', {
    message: errorMessage,
    code: err.code,
    type: err.type
  });

  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
    console.log('Network error detected, retrying in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await startBot();
  }
});

// Start the bot with retry mechanism
const startBot = async (retries = 3) => {
  try {
    console.log('Starting bot...');
    await bot.launch(() => {
      console.log('Bot started successfully!');
    })

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error: any) {
    console.error('Failed to start bot:', error.message);
    
    if (retries > 0 && (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET')) {
      console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return startBot(retries - 1);
    }
    
    process.exit(1);
  }
};

startBot(); 
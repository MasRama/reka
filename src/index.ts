import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import HyperExpress from 'hyper-express';
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
    webhookReply: process.env.NODE_ENV === 'production',
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
    
    if (process.env.NODE_ENV === 'production' && process.env.APP_URL) {
      // Setup webhook server using HyperExpress
      const app = new HyperExpress.Server();
      const port = parseInt(process.env.PORT || '3000', 10);
      const secretPath = '/webhook/' + bot.secretPathComponent();

      // Set webhook URL
      await bot.telegram.setWebhook(`${process.env.APP_URL}${secretPath}`);
      
      // Health check endpoint
      app.get('/', (req, res) => {
        res.send('Bot server is running!');
      });

      // Webhook endpoint
      app.post(secretPath, async (request, response) => {
        try {
          const update = await request.json();
          await bot.handleUpdate(update);
          response.json({ status: 'ok' });
        } catch (error) {
          console.error('Error processing webhook:', error);
          response.status(500).json({ status: 'error', message: 'Failed to process update' });
        }
      });

      // Start server
      await app.listen(port);
      console.log(`Webhook server is running on port ${port}`);
      console.log(`Webhook URL: ${process.env.APP_URL}${secretPath}`);
    } else {
      // Start in polling mode for development
      await bot.launch();
      console.log('Bot started in polling mode!');
    }

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
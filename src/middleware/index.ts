import { Telegraf, session } from 'telegraf';
import { BotContext } from '../types';

export const setupMiddleware = (bot: Telegraf<BotContext>) => {
  // Log all incoming messages
  bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date().getTime() - start.getTime();
    console.log('Response time: %sms', ms);
  });

  // Enable session middleware for wizard functionality
  bot.use(session({
    defaultSession: () => ({
      wizard: {
        step: 0,
        data: {}
      }
    })
  }));

  // Add rate limiting middleware
  bot.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error('Error in middleware:', error);
      await ctx.reply('An error occurred while processing your request.');
    }
  });
}; 
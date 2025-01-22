import { Telegraf } from 'telegraf';
import { BotContext } from '../types';

export const setupMiddleware = (bot: Telegraf<BotContext>) => {
  // Log all incoming messages
  bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date().getTime() - start.getTime();
    console.log('Response time: %sms', ms);
  });

  // Add session middleware if needed
  // bot.use(session());

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
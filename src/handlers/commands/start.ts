import { CommandHandler } from '../../types';

export const startCommand: CommandHandler = async (ctx) => {
  await ctx.reply('Welcome! 👋 I am your bot assistant.');
}; 
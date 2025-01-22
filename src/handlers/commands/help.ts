import { CommandHandler } from '../../types';

export const helpCommand: CommandHandler = async (ctx) => {
  const helpText = `
Available commands:
/start - Start the bot
/help - Show this help message
  `;
  await ctx.reply(helpText);
}; 
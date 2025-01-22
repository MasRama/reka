import { CommandHandler } from '../../types';
import { Markup } from 'telegraf';

export const tes3Command: CommandHandler = async (ctx) => {
  await ctx.reply(
    'Open Mini App Demo 🚀',
    Markup.keyboard([
      [Markup.button.webApp('Open Mini App', 'https://google.com')]
    ]).resize()
  );
}; 
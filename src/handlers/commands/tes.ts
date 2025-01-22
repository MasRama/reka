import { CommandHandler } from '../../types';
import { Markup } from 'telegraf';

export const tesCommand: CommandHandler = async (ctx) => {
  await ctx.reply('Test command with buttons! 🎉', Markup.inlineKeyboard([
    [
      Markup.button.callback('Button 1', 'tes:btn_1'),
      Markup.button.callback('Button 2', 'tes:btn_2')
    ],
    [Markup.button.callback('Button 3', 'tes:btn_3')],
    [Markup.button.url('Visit Website', 'https://google.com')]
  ]));
}; 
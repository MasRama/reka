import { BotContext } from '../../../types';
import { CallbackQuery } from 'telegraf/types';

export const actions = {
  'btn_1': async (ctx: BotContext) => {
    await ctx.answerCbQuery('You clicked Button 1!');
    await ctx.reply('Button 1 was clicked! 🎯');
  },
  'btn_2': async (ctx: BotContext) => {
    await ctx.answerCbQuery('You clicked Button 2!');
    await ctx.reply('Button 2 was clicked! 🎲');
  },
  'btn_3': async (ctx: BotContext) => {
    await ctx.answerCbQuery('You clicked Button 3!');
    await ctx.reply('Button 3 was clicked! 🎮');
  }
}; 
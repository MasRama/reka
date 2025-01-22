import { CommandHandler } from '../../types';

export const tes2Command: CommandHandler = async (ctx) => {
  await ctx.reply('*Bold text*\n' + 
    '_Italic text_\n' +
    '__Underlined text__\n' +
    '~Strikethrough~\n' +
    '*_Bold and italic_*\n' +
    '||Spoiler text||\n' +
    '[Click me](https://google.com)\n' +
    '`inline code`\n' +
    '```\nCode block\n```', {
    parse_mode: 'MarkdownV2'
  });
}; 
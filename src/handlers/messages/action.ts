import { BotContext } from '../../types';
import { CallbackQuery } from 'telegraf/types';
import * as fs from 'fs';
import * as path from 'path';

// Export the type of message this handler manages
export const type = 'callback_query';

// Action handlers cache
const actionHandlers: Record<string, Record<string, (ctx: BotContext) => Promise<void>>> = {};

// Load all action handlers
const actionsPath = path.join(__dirname, 'actions');
fs.readdirSync(actionsPath)
  .filter(file => file.endsWith('-action.ts') || file.endsWith('-action.js'))
  .forEach(file => {
    const moduleName = path.parse(file).name;
    const module = require(path.join(actionsPath, file));
    if (module.actions) {
      const commandName = moduleName.replace('-action', '');
      actionHandlers[commandName] = module.actions;
      console.log(`✅ Loaded actions for: ${commandName}`);
    }
  });

// Export the handler function
export const handler = async (ctx: BotContext) => {
  const query = ctx.callbackQuery as CallbackQuery.DataQuery;
  
  if (!query.data) return;

  // Extract command and action from callback data (format: command:action)
  const [command, action] = query.data.split(':');
  
  if (actionHandlers[command]?.[action]) {
    await actionHandlers[command][action](ctx);
  } else {
    await ctx.answerCbQuery('Action not found');
  }
}; 
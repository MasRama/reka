import { MessageHandler, TextMessageContext } from '../../types';

// Export the type of message this handler manages
export const type = 'text';

// Export the handler function
export const handler: MessageHandler<TextMessageContext> = async (ctx) => {
  const text = ctx.message.text;
  
  // Here you can add your routing logic
  if (text.startsWith('/')) {
    return; // Skip command-like messages
  }
  
//   // Handle normal text messages
//   await ctx.reply(`You said: ${text}`);
}; 
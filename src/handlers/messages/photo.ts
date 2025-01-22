import { MessageHandler, PhotoMessageContext } from '../../types';

// Export the type of message this handler manages
export const type = 'photo';

// Export the handler function
export const handler: MessageHandler<PhotoMessageContext> = async (ctx) => {
  console.log('Photo message received');
//   await ctx.reply('Nice photo! 📸');
}; 
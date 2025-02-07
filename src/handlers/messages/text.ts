import { MessageHandler, TextMessageContext } from '../../types';
import { WizardService } from '../../../services/wizard';
import * as haloWizard from './wizards/halo-wizard';

// Export the type of message this handler manages
export const type = 'text';

// Export the handler function
export const handler: MessageHandler<TextMessageContext> = async (ctx) => {
  console.log('📥 Text handler received:', ctx.message.text);
  
  try {
    const text = ctx.message.text;
    
    // Skip command-like messages
    if (text.startsWith('/')) {
      console.log('⏭️ Skipping command message');
      return;
    }

    // Check for active wizard session
    const userId = ctx.from?.id;
    if (!userId) {
      console.log('❌ No user ID found');
      return;
    }

    const session = await WizardService.getSession(userId);
    console.log('🔍 Current session:', session);

    if (session?.step) {
      console.log('🧙‍♂️ Active wizard session found');
      // Route to appropriate wizard based on type
      switch (session.data.wizardType) {
        case 'halo':
          console.log('👉 Forwarding to halo wizard');
          await haloWizard.handler(ctx, session);
          console.log('✅ Halo wizard completed');
          break;
        default:
          console.log('❓ Unknown wizard type:', session.data.wizardType);
          break;
      }
      return;
    }

    console.log('💬 No active wizard, handling as normal text');
    // Handle normal text messages here if needed
    // await ctx.reply(`You said: ${text}`);
  } catch (error) {
    console.error('❌ Error in text handler:', error);
    await ctx.reply('Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
}; 
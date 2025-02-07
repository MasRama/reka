import { TextMessageContext } from '../../../types';
import { WizardService, WizardSession } from '../../../../services/wizard';

// Handle steps for halo wizard
export const handler = async (ctx: TextMessageContext, session: WizardSession) => {
  try {
    const userId = ctx.from.id;
    console.log('🎯 Halo wizard processing step:', session.step);

    switch (session.step) {
      case 1: // Handle name input
        console.log('📝 Processing name input');
        const name = ctx.message.text.trim();
        console.log('✍️ Name received:', name);
        
        // Send response first
        console.log('📤 Sending response');
        await ctx.reply(`Halo ${name}!`);
        console.log('✅ Response sent');

        // Clean up wizard session
        console.log('🧹 Cleaning up wizard session');
        await WizardService.deleteSession(userId);
        console.log('✨ Wizard session cleaned up');
        break;

      default:
        console.log('❓ Unknown step for halo wizard:', session.step);
        break;
    }
  } catch (error) {
    console.error('❌ Error in halo wizard step:', error);
    throw error; // Let the main router handle the error
  }
}; 
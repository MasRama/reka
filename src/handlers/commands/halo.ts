import { CommandHandler } from '../../types';
import { WizardService } from '../../../services/wizard.service';

export const haloCommand: CommandHandler = async (ctx) => {
  try {
    const userId = ctx.from?.id;
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Initialize wizard session
    await WizardService.createOrUpdateSession(userId, 1, {
      wizardType: 'halo'
    });

    await ctx.reply('Siapa namamu?');
  } catch (error) {
    console.error('Error in halo command:', error);
    await ctx.reply('Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
}; 
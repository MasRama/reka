import db from './db';

interface WizardData {
  name?: string;
  [key: string]: any;
}

export interface WizardSession {
  user_id: number;
  step: number;
  data: WizardData;
  created_at?: Date;
  updated_at?: Date;
}

export class WizardService {
  private static readonly tableName = 'wizard_sessions';

  static async getSession(userId: number): Promise<WizardSession | null> {
    try {
      console.log('Getting session for user:', userId);
      const session = await db(this.tableName)
        .where('user_id', userId)
        .first();
      
      if (session) {
        // Parse JSON string back to object
        session.data = JSON.parse(session.data as string);
      }
      
      console.log('Retrieved session:', session);
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }

  static async createOrUpdateSession(userId: number, step: number, data: WizardData): Promise<void> {
    try {
      console.log('Creating/updating session for user:', userId, 'step:', step, 'data:', data);
      const exists = await this.getSession(userId);

      // Convert data object to JSON string for storage
      const jsonData = JSON.stringify(data);

      if (exists) {
        console.log('Updating existing session');
        await db(this.tableName)
          .where('user_id', userId)
          .update({
            step,
            data: jsonData,
            updated_at: new Date()
          });
        console.log('Session updated');
      } else {
        console.log('Creating new session');
        await db(this.tableName).insert({
          user_id: userId,
          step,
          data: jsonData,
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log('Session created');
      }
    } catch (error) {
      console.error('Error creating/updating session:', error);
      throw error;
    }
  }

  static async deleteSession(userId: number): Promise<void> {
    try {
      console.log('Deleting session for user:', userId);
      await db(this.tableName)
        .where('user_id', userId)
        .delete();
      console.log('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  static async resetSession(userId: number): Promise<void> {
    try {
      console.log('Resetting session for user:', userId);
      await this.createOrUpdateSession(userId, 0, {});
      console.log('Session reset');
    } catch (error) {
      console.error('Error resetting session:', error);
      throw error;
    }
  }
} 
import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/types';

// Extend the context type to add custom properties
export interface BotContext extends Context {
  session?: {
    wizard?: {
      step: number;
      data: {
        name?: string;
      };
    };
  };
}

// Command handler type
export type CommandHandler = (ctx: BotContext) => Promise<void>;

// Message handler types
export type MessageContext = NarrowedContext<BotContext, Update.MessageUpdate>;
export type TextMessageContext = NarrowedContext<BotContext, {
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>;
export type PhotoMessageContext = NarrowedContext<BotContext, {
  message: Update.New & Update.NonChannel & Message.PhotoMessage;
  update_id: number;
}>;

export type MessageHandler<T extends MessageContext = MessageContext> = (ctx: T) => Promise<void>; 
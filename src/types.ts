import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  ClientEvents,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

interface EventType {
  name: keyof ClientEvents; // an enum of possible event names the bot can receive
  once: boolean; // when true, the event will only execute once
  execute: (client: BotClientType, ...args: any[]) => any;
}

interface CommandType {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<any>;
}

interface BotClientType extends Client {
  commands: Collection<string, CommandType>;
}

export { EventType, CommandType, BotClientType };

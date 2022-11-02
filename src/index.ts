import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { Config } from './config';
import { logger } from './logger';
import { BotClientType, CommandType, EventType } from './types';
import path = require('path');

const start = async () => {
  logger.level = Config.testing.log_level;
  logger.info('Bot is starting...');

  const botClient = new Client({
    intents: ['Guilds'],
  }) as BotClientType;

  // Local cache of commands that have known handlers
  botClient.commands = new Collection<string, CommandType>();

  // Directory scan
  const eventFolderName = 'events';
  const eventFiles = readdirSync(path.join(__dirname, eventFolderName))
    .filter((filename) => filename.endsWith('.ts') || filename.endsWith('.js'))
    .map((filename) => filename.slice(0, -3)) // drop extension, works cuz we filtered to .ts and .js only
    .map((filename) => ['.', eventFolderName, filename].join(path.sep)); // path.join does a normalize which breaks the relative link :/

  logger.debug(eventFiles, 'Detected the following event files: ');

  // Register events
  for (const filePath of eventFiles) {
    const { event } = require(filePath) as { event: EventType | undefined };
    if (!event) {
      logger.warn(`${filePath} does not export an EventType named event.`);
      return;
    }

    logger.info(`Registering ${event.name}${event.once && ' (once)'} to ${filePath}`);

    if (event.once) {
      botClient.once(event.name, (...eventArgs) => event.execute(botClient, ...eventArgs));
    } else {
      botClient.on(event.name, (...eventArgs) => event.execute(botClient, ...eventArgs));
    }
  }

  await botClient.login(Config.discord.api_token);
};

start();

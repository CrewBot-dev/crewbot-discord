import { readdirSync } from 'fs';
import path = require('path');
import { Config } from '../config';
import { logger } from '../logger';
import { BotClientType, CommandType, EventType } from '../types';

const onReadyEvent: EventType = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    await registerSlashCommands(client);

    logger.info('Bot is ready.');
  },
};

const registerSlashCommands = async (botClient: BotClientType) => {
  // Directory scan
  const commandFolderPath = '../commands';
  const commandFiles = readdirSync(path.join(__dirname, commandFolderPath))
    .filter((filename) => filename.endsWith('.ts') || filename.endsWith('.js'))
    .map((filename) => filename.slice(0, -3))
    .map((filename) => ['.', commandFolderPath, filename].join(path.sep));

  logger.debug(commandFiles, 'Detected the following command files:');

  for (const filePath of commandFiles) {
    const { command } = require(filePath) as { command: CommandType };
    botClient.commands.set(command.data.name, command);
  }

  // Convert to API-compatible repr. and register
  const appCommands = botClient.commands.map((command) => command.data.toJSON());

  if (Config.testing.debug) {
    await botClient.application!.commands.set(appCommands, Config.testing.guild);
  } else {
    await botClient.application!.commands.set(appCommands);
  }

  logger.info('Finished registering slash commands');
};

export { onReadyEvent as event };

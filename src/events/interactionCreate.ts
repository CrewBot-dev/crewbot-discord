import { BaseInteraction, CacheType } from 'discord.js';
import { logger } from '../logger';
import { EventType } from '../types';

const onInteractionCreateEvent: EventType = {
  name: 'interactionCreate',
  once: false,
  execute: async (client, interaction: BaseInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) {
      logger.warn('Invalid type of interaction received');
      return;
    }

    const commandToExecute = client.commands.get(interaction.commandName);
    if (!commandToExecute) {
      logger.warn('Slash command received with no known handler');
      return;
    }

    try {
      await commandToExecute.execute(interaction);
    } catch (error) {
      logger.error({
        obj: error,
        msg: `The following error occurred while handling '${interaction.commandName}'`,
      });

      await interaction.reply({
        content: 'An error ocurred while processing the command.',
        ephemeral: true,
      });
    }
  },
};

export { onInteractionCreateEvent as event };

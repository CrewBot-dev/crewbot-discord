import { SlashCommandBuilder } from 'discord.js';
import { CommandType } from '../types';

const pingCommand: CommandType = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Ping... pong?'),
  execute: async (interaction) => {
    // Say "Pong!", visible only to the command user
    await interaction.reply({ content: 'Pong!', ephemeral: true });
  },
};

export { pingCommand as command };

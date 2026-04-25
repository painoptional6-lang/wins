const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Voice channel controls')
        .addSubcommand(sub =>
            sub.setName('join').setDescription('Bot joins your voice channel')
        )
        .addSubcommand(sub =>
            sub.setName('leave').setDescription('Bot leaves the voice channel')
        ),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const channel = interaction.member.voice.channel;

        if (sub === 'join') {
            if (!channel)
                return interaction.reply('You must be in a voice channel.');

            joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            return interaction.reply(`Joined **${channel.name}**`);
        }

        if (sub === 'leave') {
            const connection = getVoiceConnection(interaction.guild.id);
            if (!connection)
                return interaction.reply('I am not in a voice channel.');

            connection.destroy();
            return interaction.reply('Left the voice channel.');
        }
    }
};

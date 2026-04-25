import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';

export default {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription('Voice commands')
        .addSubcommand(sub =>
            sub.setName('join').setDescription('Bot joins your VC')
        ),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You must be in a voice channel');

        joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator
        });

        return interaction.reply(`Joined **${channel.name}**`);
    }
};

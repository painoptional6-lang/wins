import { SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { errorEmbed, successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vc')
        .setDescription('Voice channel controls')
        .addSubcommand(sub =>
            sub.setName('join').setDescription('Bot joins your voice channel')
        )
        .addSubcommand(sub =>
            sub.setName('leave').setDescription('Bot leaves the voice channel')
        ),

    category: "Voice",

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const channel = interaction.member.voice.channel;

        if (!channel) {
            return InteractionHelper.safeReply(interaction, {
                embeds: [errorEmbed('Not in Voice Channel', 'You must be in a voice channel to use this command.')]
            });
        }

        if (sub === 'join') {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            return InteractionHelper.safeReply(interaction, {
                embeds: [successEmbed('Joined Voice Channel', `Connected to **${channel.name}**`)]
            });
        }

        if (sub === 'leave') {
            const connection = getVoiceConnection(interaction.guild.id);

            if (!connection) {
                return InteractionHelper.safeReply(interaction, {
                    embeds: [errorEmbed('Not Connected', 'I am not in a voice channel.')]
                });
            }

            connection.destroy();

            return InteractionHelper.safeReply(interaction, {
                embeds: [successEmbed('Left Voice Channel', 'Disconnected successfully.')]
            });
        }
    }
};

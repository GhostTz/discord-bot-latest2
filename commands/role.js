const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Ermöglicht das Auswählen und Entfernen von Rollen'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('🎭 Rollen Auswahl') 
            .setDescription('Wähle die Rollen aus, die du haben möchtest oder entfernen möchtest. Diese Rollen erlauben es dir, bestimmte Benachrichtigungen zu erhalten.')
            .setThumbnail('https://example.com/thumbnail.png') 
            .addFields(
                { name: '🎬 Upload Ping', value: 'Erhalte eine Benachrichtigung, wenn ein neues Updatge raus ist', inline: false },
                { name: '📢 Announcement Ping', value: 'Erhalte eine Benachrichtigung bei Ankündigungen.', inline: false },
                { name: '🎁 Giveaway Ping', value: 'Erhalte eine Benachrichtigung bei Giveaways.', inline: false }
            )
            .setFooter({ 
                text: 'Wähle deine Rollen und bleibe immer informiert!',
                iconURL: interaction.guild.iconURL() 
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select-roles')
            .setPlaceholder('Wähle deine Rollen')
            .setMinValues(0)
            .setMaxValues(3)
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Upload Ping')
                    .setDescription('Erhalte eine Benachrichtigung, wenn ein neues Updatge raus ist.')
                    .setValue('1267235626281861252'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Announcement Ping')
                    .setDescription('Erhalte eine Benachrichtigung bei Ankündigungen.')
                    .setValue('1267442804120879276'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Giveaway Ping')
                    .setDescription('Erhalte eine Benachrichtigung bei Giveaways.')
                    .setValue('1267442958408618087')
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};

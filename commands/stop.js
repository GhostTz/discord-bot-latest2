const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stoppt den Bot. Nur autorisierte Benutzer können diesen Befehl verwenden.'),
    async execute(interaction) {
        const authorizedUserId = '966050274437382205';

        if (interaction.user.id !== authorizedUserId) {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.', ephemeral: true });
        }

        await interaction.reply('Der Bot wird gestoppt...');

        process.exit();
    },
};

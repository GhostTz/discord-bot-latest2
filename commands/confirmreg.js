const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confirmreg')
        .setDescription('Bestätigt eine Registrierung und sendet die Daten per DM.')
        .addStringOption(option =>
            option.setName('benutzername')
                .setDescription('Der Benutzername für die Registrierung.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('passwort')
                .setDescription('Das Passwort für die Registrierung.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Der Benutzer, der die Registrierungsdaten erhalten soll.')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== '966050274437382205') {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.', ephemeral: true });
        }

        const benutzername = interaction.options.getString('benutzername');
        const passwort = interaction.options.getString('passwort');
        const user = interaction.options.getUser('user');

        const confirmationEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Registrierung Bestätigt')
            .setDescription(`Die Registrierung wurde bestätigt.\n\n**Benutzername:** \`\`\`${benutzername}\`\`\`\n**Passwort:** \`\`\`${passwort}\`\`\``)
            .addFields(
                { name: 'Benutzer', value: `\`\`\`${user.username}\`\`\`\nUserID: \`\`\`${user.id}\`\`\``, inline: true }
            )
            .setTimestamp();

        try {
            await interaction.reply({
                embeds: [confirmationEmbed],
                ephemeral: true
            });

            const dmEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Registrierungsdetails')
                .setDescription(`Hey! Deine Anmeldedaten sind bereit:\n\n**Benutzername:** \`\`\`${benutzername}\`\`\`\n**Passwort:** \`\`\`${passwort}\`\`\`\n`)
                .setTimestamp();

            await user.send({ embeds: [dmEmbed] });

        } catch (error) {
            console.error('Fehler beim Senden der DM oder Bestätigungsnachricht:', error);
            await interaction.reply({ content: 'Es gab einen Fehler beim Senden der Nachricht.', ephemeral: true });
        }
    },
};

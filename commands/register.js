const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registriert einen neuen Benutzer.')
        .addStringOption(option => 
            option.setName('benutzername')
                .setDescription('Der Benutzername des neuen Kontos.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('password')
                .setDescription('Das Passwort des neuen Kontos.')
                .setRequired(true)),
    async execute(interaction) {
        const benutzername = interaction.options.getString('benutzername');
        const password = interaction.options.getString('password');

        const userName = interaction.user.username;
        const userId = interaction.user.id;

        const CHANNEL_ID = '1267228306844155985';

        const channel = interaction.client.channels.cache.get(CHANNEL_ID);

        if (channel) {
            const channelEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Neuer Registrierungseingang')
                .setDescription('Ein neuer Benutzer hat sich registriert.')
                .addFields(
                    { name: 'Benutzername', value: `${benutzername}`, inline: true },
                    { name: 'Passwort', value: `${password}`, inline: true },
                    { name: 'Discord Benutzername', value: `${userName}`, inline: true },
                    { name: 'User ID', value: `${userId}`, inline: true }
                )
                .setTimestamp();

            try {
                await channel.send({ embeds: [channelEmbed] });
            } catch (error) {
                console.error('Fehler beim Senden der Registrierungsdaten:', error);
            }
        } else {
            console.log('Channel nicht gefunden.');
        }

        const confirmationEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Registrierung Bestätigt')
            .setDescription(`Ihre anfrage zur Registrierung wurde erfolgreich gesendet!\n\nBenutzername: \`\`\`${benutzername}\`\`\`\nPasswort: \`\`\`${password}\`\`\`\n Es kann bis zu 24h dauern, bis deine Registrierung bestätigt wurde. `)
            .setTimestamp();

        try {
            await interaction.reply({
                embeds: [confirmationEmbed],
                ephemeral: true
            });
        } catch (error) {
            console.error('Fehler beim Senden der Bestätigungsnachricht:', error);
        }
    },
};

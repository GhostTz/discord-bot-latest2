const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addaccount')
        .setDescription('Fügt ein Konto hinzu.')
        .addStringOption(option =>
            option.setName('benutzername')
                .setDescription('Der Benutzername des Kontos.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('passwort')
                .setDescription('Das Passwort des Kontos.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Optional: Der Benutzer, dem die Kontodaten zugeordnet werden sollen.')),
    async execute(interaction) {
        if (interaction.user.id !== '966050274437382205') {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.', ephemeral: true });
        }

        const benutzername = interaction.options.getString('benutzername');
        const passwort = interaction.options.getString('passwort');
        const user = interaction.options.getUser('user');

        const account = {
            username: benutzername,
            password: passwort,
            creationDate: new Date().toISOString(),
            user: user ? { username: user.username, id: user.id } : 'nicht vorhanden',
        };

        const filePath = path.join(__dirname, '../accounts.json');

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.error('Fehler beim Lesen der JSON-Datei:', error);
            accounts = [];
        }

        accounts.push(account);

        try {
            fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
        } catch (error) {
            console.error('Fehler beim Speichern der JSON-Datei:', error);
            return interaction.reply({ content: 'Es gab einen Fehler beim Speichern der Account-Daten.', ephemeral: true });
        }

        const confirmationEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('Account hinzugefügt')
            .setDescription(`Der Account wurde erfolgreich hinzugefügt.\n\n**Benutzername:** \`\`\`${benutzername}\`\`\`\n**Passwort:** \`\`\`${passwort}\`\`\`\n**Erstellungsdatum:** \`\`\`${account.creationDate}\`\`\`\n**Benutzer:** \`\`\`${account.user.username}\`\`\``)
            .setTimestamp();

        await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
    },
};

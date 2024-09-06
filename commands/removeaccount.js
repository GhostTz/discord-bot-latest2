const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeaccount')
        .setDescription('Löscht ein Konto.')
        .addStringOption(option =>
            option.setName('benutzername')
                .setDescription('Der Benutzername des Kontos.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('Die Benutzer-ID des Kontos.')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Der Benutzer, dessen Konto gelöscht werden soll.')
                .setRequired(false)),
    async execute(interaction) {
        if (interaction.user.id !== '966050274437382205') {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.', ephemeral: true });
        }

        const benutzername = interaction.options.getString('benutzername');
        const userid = interaction.options.getString('userid');
        const user = interaction.options.getUser('user');

        const filePath = path.join(__dirname, '../accounts.json');

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.error('Fehler beim Lesen der JSON-Datei:', error);
            return interaction.reply({ content: 'Es gab einen Fehler beim Lesen der Account-Daten.', ephemeral: true });
        }

        let accountIndex = -1;
        if (benutzername) {
            accountIndex = accounts.findIndex(account => account.username === benutzername);
        } else if (userid) {
            accountIndex = accounts.findIndex(account => account.user && account.user.id === userid);
        } else if (user) {
            accountIndex = accounts.findIndex(account => account.user && account.user.id === user.id);
        } else {
            return interaction.reply({ content: 'Bitte geben Sie entweder einen Benutzernamen, eine Benutzer-ID oder einen Benutzer an.', ephemeral: true });
        }

        if (accountIndex === -1) {
            return interaction.reply({ content: 'Kein Konto mit den angegebenen Informationen gefunden.', ephemeral: true });
        }

        const removedAccount = accounts.splice(accountIndex, 1)[0];

        try {
            fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
        } catch (error) {
            console.error('Fehler beim Speichern der JSON-Datei:', error);
            return interaction.reply({ content: 'Es gab einen Fehler beim Speichern der Account-Daten.', ephemeral: true });
        }

        const confirmationEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Account gelöscht')
            .setDescription(`Der Account wurde erfolgreich gelöscht.\n\n**Benutzername:** ${removedAccount.username}\n**Erstellungsdatum:** ${removedAccount.creationDate}\n**Benutzer:** ${removedAccount.user ? removedAccount.user.username : 'nicht vorhanden'}`)
            .setTimestamp();

        await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
    },
};

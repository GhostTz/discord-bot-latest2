const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Löscht eine bestimmte Anzahl an Nachrichten.')
        .addIntegerOption(option => 
            option.setName('anzahl')
                .setDescription('Die Anzahl der zu löschenden Nachrichten')
                .setRequired(true)),
    async execute(interaction) {
        const anzahl = interaction.options.getInteger('anzahl');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen. Du benötigst die Berechtigung "Nachrichten verwalten".', ephemeral: true });
        }

        if (anzahl < 1 || anzahl > 100) {
            return interaction.reply({ content: 'Du musst eine Zahl zwischen 1 und 100 eingeben.', ephemeral: true });
        }

        try {
            const deletedMessages = await interaction.channel.bulkDelete(anzahl, true);
            await interaction.reply({ content: `Erfolgreich ${deletedMessages.size} Nachrichten gelöscht.`, ephemeral: true });

            const logMessage = `Befehl clear ausgeführt von ${interaction.user.tag} in ${interaction.guild.name}, um ${anzahl} Nachrichten zu löschen.`;
            console.log(logMessage);
            
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Es gab einen Fehler beim Versuch, Nachrichten in diesem Kanal zu löschen!', ephemeral: true });
        }
    },
};

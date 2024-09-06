const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewaccounts')
        .setDescription('Zeigt alle gespeicherten Account-Daten an.'),
    async execute(interaction) {
        if (interaction.user.id !== '966050274437382205') {
            return interaction.reply({ content: 'Du hast keine Berechtigung, diesen Befehl auszuführen.', ephemeral: true });
        }

        const filePath = path.join(__dirname, '../accounts.json');

        let accounts;
        try {
            accounts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            console.error('Fehler beim Lesen der JSON-Datei:', error);
            return interaction.reply({ content: 'Es gab einen Fehler beim Lesen der Account-Daten.', ephemeral: true });
        }

        const createEmbed = (accounts, page) => {
            const start = page * 3; 
            const end = start + 3;
            const accountsPage = accounts.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Account-Daten')
                .setTimestamp()
                .setFooter({ text: `Seite ${page + 1} von ${Math.ceil(accounts.length / 3)}` });

            accountsPage.forEach((account, index) => {
                const userInfo = account.user && typeof account.user === 'object' 
                    ? `**Benutzer:** ${account.user.username} (ID: ${account.user.id})` 
                    : `**Benutzer:** ${account.user || 'nicht vorhanden'}`;

                embed.addFields({
                    name: `__Account ${start + index + 1}__`,
                    value: `**Benutzername:** \`\`\`${account.username}\`\`\`\n**Passwort:** \`\`\`${account.password}\`\`\`\n**Erstellungsdatum:** \`\`\`${account.creationDate}\`\`\`\n${userInfo}`,
                    inline: false,
                });
            });

            return embed;
        };

        const totalPages = Math.ceil(accounts.length / 3);
        let currentPage = 0;

        const createButtons = () => {
            const prevButton = new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Zurück')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage === 0);

            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Weiter')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(currentPage >= totalPages - 1);

            return new ActionRowBuilder().addComponents(prevButton, nextButton);
        };

        await interaction.reply({ embeds: [createEmbed(accounts, currentPage)], components: [createButtons()], ephemeral: true });

        const filter = i => i.customId === 'prev' || i.customId === 'next';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: 'Das gehört dir nicht!', ephemeral: true });
            }

            if (i.customId === 'prev') {
                currentPage--;
            } else if (i.customId === 'next') {
                currentPage++;
            }

            await i.update({ embeds: [createEmbed(accounts, currentPage)], components: [createButtons()] });
        });

        collector.on('end', collected => {
            interaction.editReply({ components: [] });
        });
    },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

const accountsFilePath = './accounts.json';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Zeigt grundlegende Informationen über den Discord-Account und dein Konto an'),
    async execute(interaction) {
        const user = interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        let blixxzAccount;

        try {
            const accountsData = JSON.parse(fs.readFileSync(accountsFilePath, 'utf8'));
            blixxzAccount = accountsData.find(account => account.user.id === user.id);
        } catch (error) {
            console.error('Fehler beim Laden der accounts.json Datei:', error);
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`**__ℹ️ ${user.username}'s Info__**`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Discord Name', value: user.username, inline: true },
                { name: '🆔 Discord ID', value: user.id, inline: true },
                { name: '📅 Erstellungsdatum', value: user.createdAt.toDateString(), inline: true },
                { name: '📥 Beitrittsdatum', value: member.joinedAt.toDateString(), inline: true },
            );

        if (blixxzAccount) {
            embed.addFields(
                { name: '\u200B', value: '\u200B' },   
                { name: '🔗 Konto', value: '\u200B' },
                { name: '🖥️ Benutzername', value: blixxzAccount.username, inline: true },
                { name: '📅 Erstellungsdatum', value: new Date(blixxzAccount.creationDate).toDateString(), inline: true }
            );
        } else {
            embed.addFields(
                { name: '\u200B', value: '\u200B' },  
                { name: '🔗 Konto', value: 'Keine Informationen gefunden', inline: true }
            );
        }

        await interaction.reply({ embeds: [embed] });
    },
};

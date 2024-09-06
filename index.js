const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,       
        GatewayIntentBits.DirectMessages      
    ]
});

const WELCOME_CHANNEL_ID = '1267225628839510168'; 
const CLEANUP_CHANNEL_ID = '1267234284905955422'; 

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);


    setInterval(cleanUpChannel, 30000);
});

client.on(Events.GuildMemberAdd, async member => {
    const avatarUrl = member.user.avatarURL({ format: 'png', size: 1024 });

    const welcomeChannel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    const cmdChannelMention = `<#${CLEANUP_CHANNEL_ID}>`; 

    if (welcomeChannel) {
        try {
            // Erstelle den Embed für die Willkommensnachricht im Kanal
            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Willkommen!')
                .setDescription(`Herzlich willkommen auf dem Discord Server, ${member.user}!`)
                .setThumbnail(avatarUrl)
                .setTimestamp();

            await welcomeChannel.send({ content: `${member.user}`, embeds: [embed] });

            const dmEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Willkommen auf dem Server!')
                .setDescription(`Hallo ${member.user.username},\n\n` +
                    `Willkommen auf dem Server! Du kannst im ${cmdChannelMention}-Kanal deinen Account erstellen und deine Rollen wählen.`)
                .setThumbnail(avatarUrl)
                .setTimestamp();

            try {
                await member.send({ embeds: [dmEmbed] });
            } catch (error) {
                console.error('Fehler beim Senden der DM:', error);
            }

        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
        }
    } else {
        console.log('Channel nicht gefunden.');
    }
});



client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'select-roles') {
            const selectedRoles = interaction.values;
            const member = interaction.member;

            const roleIds = ['1267235626281861252', '1267442804120879276', '1267442958408618087'];

            await member.roles.remove(roleIds);

            if (selectedRoles.length > 0) {
                await member.roles.add(selectedRoles);
            }

            await interaction.reply({ content: 'Deine Rollen wurden aktualisiert!', ephemeral: true });
        }
    } else if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        const logMessage = `
        -------------------------------------
        Command:  | ${interaction.commandName}
        User:     | ${interaction.user.tag}
        Server:   | ${interaction.guild.name}
        Timestamp:| ${new Date().toLocaleString()}
        -------------------------------------
        `;

        // Logging to console
        console.log(logMessage);

        const embed = {
            title: 'Command Executed',
            description: `A command was executed in the server.`,
            color: 0x0099ff,
            fields: [
                {
                    name: 'Command',
                    value: interaction.commandName,
                    inline: true,
                },
                {
                    name: 'User',
                    value: interaction.user.username,
                    inline: true,
                },
                {
                    name: 'Server',
                    value: interaction.guild.name,
                    inline: true,
                },
            ],
            timestamp: new Date(),
        };

        try {
            await axios.post(process.env.WEBHOOK_URL, {
                embeds: [embed],
            });
        } catch (error) {
            console.error('Error sending log to webhook:', error);
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});


async function cleanUpChannel() {
    try {
        const channel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
        if (!channel) {
            console.log('Channel nicht gefunden!');
            return;
        }

        const messages = await channel.messages.fetch({ limit: 100 });
        const pinnedMessages = await channel.messages.fetchPinned();
        const messagesToDelete = messages.filter(msg => !pinnedMessages.has(msg.id));

        await Promise.all(messagesToDelete.map(async msg => {
            try {
                await msg.delete();
                console.log(`Nachricht gelöscht: [User: ${msg.author.tag}, ID: ${msg.id}, Inhalt: "${msg.content}"]`);
            } catch (error) {
                console.error('Fehler beim Löschen der Nachricht:', error);
            }
        }));

        console.log('Alle nicht gepinnten Nachrichten wurden gelöscht.');
    } catch (error) {
        console.error('Fehler beim Löschen der Nachrichten:', error);
    }
}

client.login(process.env.TOKEN);

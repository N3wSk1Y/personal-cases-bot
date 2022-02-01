import { Client, Intents, MessageSelectMenu, MessageEmbed, MessageActionRow, MessageButton  } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'ts-replace-all';
import { Token, GuildId, CasesChannel, Ranks, Divisions } from './config.json';
const wait = require('util').promisify(setTimeout);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const guild = client.guilds.fetch(GuildId);


client.once('ready', () => {
	console.log('Ready!');
});

const commands = [
    {
      name: 'newcase',
      description: 'Создать новое личное дело.',
    },
];

const Executive: string[] = [
    "Sheriff", "Undersheriff", "Assist.Sheriff", "CoD", "AC"
]

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('updatecase')
            .setLabel('Обновить информацию')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('newpatrol')
            .setLabel('Патрульный лог')
            .setStyle('SUCCESS'),
    );
    
const marks = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
        .setCustomId('marks')
        .setPlaceholder('Выберите маркировку и время патруля.')
        .setMinValues(3)
        .setMaxValues(3)
        .addOptions([
        {
            label: 'OMEGA',
            description: 'Маркировка Executive Staff.',
            value: 'omega',
        },
        {
            label: 'ROMEO',
            description: 'Стандартная патрульная маркировка.',
            value: 'romeo',
        },
        {
            label: 'CHARLIE',
            description: 'Маркировка Special Enforcement Bureau.',
            value: 'charlie',
        },
        {
            label: 'NORA',
            description: 'Маркировка Detective Bureau.',
            value: 'nora',
        },
        {
            label: '1',
            value: '1',
        },
        {
            label: '2',
            value: '2',
        },
        {
            label: '3',
            value: '3',
        },
        {
            label: '4',
            value: '4',
        },
        {
            label: '5',
            value: '5',
        },
        {
            label: '6',
            value: '6',
        },
        {
            label: '7',
            value: '7',
        },
        {
            label: '10',
            value: '10',
        },
        {
            label: '20',
            value: '20',
        },
        {
            label: '30',
            value: '30',
        },
        {
            label: '40',
            value: '40',
        },
        {
            label: 'минут',
            value: 'минут',
        },
        {
            label: 'час(ов)',
            value: 'час(ов)',
        },
]))

const rest = new REST({ version: '9' }).setToken(Token);

function UpdateCase(username: string, usertoken: string, patrols: string, executive: boolean = false): object {
    const name: string = username.trim();

    if(!executive) {
        var rank: string = username.slice(name.indexOf('[')+1, name.indexOf(']')).trim();
        var employee: string = username.slice(username.indexOf(']')+1).slice(0, username.slice(username.indexOf(']')+1).indexOf('[')).trim();
        var division: string = username.slice(username.indexOf(']')+1).slice(username.slice(username.indexOf(']')+1).indexOf('[')+1, -1).trim();
    } else {
        var division: string = 'Executive Staff';
        var employee: string = username.slice(username.indexOf(']')+1).trim();
        var rank: string = username.slice(username.indexOf('[')+1, username.indexOf(']')).trim();
    }

    const CaseEmbed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle('Личное дело')
        .setAuthor({ name: '© BCSO', iconURL: 'https://static.wikia.nocookie.net/gtawiki/images/3/32/LSSD.png/revision/latest?cb=20150829032550' })
        .setThumbnail('https://i.pinimg.com/originals/d1/d7/92/d1d7924e1e34845c368da9ce1ac603f8.png')
        .addFields(
            { name: 'Имя сотрудника', value: employee, inline: false },
            { name: 'Ранг сотрудника', value: rank, inline: true },
            { name: 'Отдел сотрудника', value: division, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: usertoken + " | Обновлено", iconURL: 'https://static.wikia.nocookie.net/gtawiki/images/3/32/LSSD.png/revision/latest?cb=20150829032550' });
    CaseEmbed.setDescription(patrols)
    return CaseEmbed;
}

client.on('interactionCreate', async interaction => {
    const servername: string = (await (await guild).members.fetch(interaction.user.id)).displayName;

	if (interaction.isCommand()){
        if (interaction.commandName === 'newcase') {
            if(interaction.channelId === CasesChannel) {

                interaction.channel.messages.fetch({ limit: 150 }).then(messages => {
                    messages.forEach(message => console.log(message.content))
                })

                if(servername.split('[').length-1 >= 1 && servername.split(']').length-1 >= 1) {
                    if((servername.split('[').length-1 == 2 && servername.split(']').length-1 == 2) || Executive.includes(servername.slice(servername.indexOf('[')+1, servername.indexOf(']')).trim())) {
                        interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [UpdateCase(servername, interaction.user.tag, '```Патрульный лог:\n```', Executive.includes(servername.slice(servername.indexOf('[')+1, servername.indexOf(']')).trim()))], components: [row], ephemeral: false }) 
                    } else interaction.reply({ content: "**Вы не указали отдел. Форма ника: `[Ранг] NickName [Отдел]`**", ephemeral: true })

                } else {
                    interaction.reply({ content: "**Ваш ник не по форме: `[Ранг] NickName [Отдел]`**", ephemeral: true })
                }

            } else interaction.reply({ content: `**Создавать личные дела можно только в канале <#${CasesChannel}>**`, ephemeral: true })
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'updatecase') {
            try {
                if(interaction.message.content == `<@${interaction.user.id}>`) {
                (async () => {
                    await interaction.update({ content: `<@${interaction.user.id}>`, embeds: [UpdateCase(servername, interaction.user.tag, interaction.message.embeds[0].description, Executive.includes(servername.slice(servername.indexOf('[')+1, servername.indexOf(']')).trim()))], components: [row] });
                })() 

                } else {
                    interaction.reply({ content: "**Вы можете обновлять только ВАШЕ личное дело!**", ephemeral: true })
                }
            } catch(err) {
                console.error(err);
            }
        }

        if (interaction.customId === 'newpatrol') {
            try {
                if(interaction.message.content == `<@${interaction.user.id}>`) {
                (async () => {
                    await interaction.update({ content: `<@${interaction.user.id}>`, embeds: [UpdateCase(servername, interaction.user.tag, interaction.message.embeds[0].description, Executive.includes(servername.slice(servername.indexOf('[')+1, servername.indexOf(']')).trim()))], components: [marks] });
                })() 

                } else {
                    interaction.reply({ content: "**Вы можете обновлять только ВАШЕ личное дело!**", ephemeral: true })
                }
            } catch(err) {
                console.error(err);
            }
        }
    }

    if(interaction.isSelectMenu()) {
        if(interaction.customId == 'marks') {
            (async () => {
                const log: string = `\n${interaction.values[0].toUpperCase()} | Время в патруле: ${interaction.values[1]} ${interaction.values[2]}`
                await interaction.update({ content: `<@${interaction.user.id}>`, embeds: [UpdateCase(servername, interaction.user.tag, "```"+((interaction.message.embeds[0].description).toString().replaceAll('```', '') + log)+"```", Executive.includes(servername.slice(servername.indexOf('[')+1, servername.indexOf(']')).trim()))], components: [row] });
            })() 
        }
    }


});

client.login(Token);
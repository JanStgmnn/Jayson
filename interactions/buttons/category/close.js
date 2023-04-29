/**
 * @file Sample button interaction
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 3.2.2
 */

const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	PermissionFlagsBits,
	ChannelType,
	ButtonStyle,
} = require("discord.js");
const Schema = require("../../../models/tickets.js");
const transcript = require("discord-html-transcripts");

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
	id: "close",

	async execute(interaction) {
		const data = await Schema.findOne({
			ChannelID: interaction.channel.id,
		});

		if (!data)
			return interaction.reply({
				content:
					"The ticket could not be found, please contact an administrator!",
				ephemeral: true,
			});

		const channel = await interaction.client.channels.fetch(data.ChannelID);

		const attachment = await transcript.createTranscript(channel);

		const transcriptEmebd = new EmbedBuilder()
			.setTitle("Ticket Notification")
			.setDescription(
				"Your ticket has been closed, please find the transcript below. If you need further assistance, please open a new ticket."
			)
			.setColor(2292922)
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			)
			.setTimestamp();

		const user = await interaction.client.users.fetch(data.UserID);

		await user.send({
			embeds: [transcriptEmebd],
			files: [attachment],
		});

		const transcriptChannel = await interaction.client.channels.fetch(
			"1101994756021682309"
		);

		const transcriptEmbed = new EmbedBuilder()
			.setTitle("Ticket Transcript")
			.setDescription("Ticket Transcript for <@" + data.UserID + ">")
			.setColor(2292922)
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			)
			.setTimestamp();

		await transcriptChannel.send({
			embeds: [transcriptEmbed],
			files: [attachment],
		});

		await Schema.findOneAndDelete({
			ChannelID: interaction.channel.id,
		});

		await channel.delete();

		await interaction.reply({
			content: "Your ticket has been closed!",
			ephemeral: true,
		});
		return;
	},
};

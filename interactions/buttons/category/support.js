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

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
	id: "support",

	async execute(interaction) {
		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});

		if (data)
			return interaction.reply({
				content: "You already have a ticket open! <#" + data.ChannelID + ">",
				ephemeral: true,
			});

		const channel = await interaction.guild.channels.create({
			name: "📝│" + interaction.user.username,
			type: ChannelType.GuildText,
			parent: "1101990531724218439",
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [PermissionFlagsBits.ViewChannel],
				},
			],
		});

		new Schema({
			UserID: interaction.user.id,
			ChannelID: channel.id,
			Type: "Support",
			CategoryID: "1101990531724218439",
			PaymentType: "None",
			Amount: 0,
			Approval: false,
			Status: "Open",
		}).save();

		const replyEmbed = new EmbedBuilder()
			.setTitle("Support Ticket")
			.setDescription(
				"Hello <@!" +
					interaction.user.id +
					">\nPlease describe your issue in as much detail as possible. I will be with you shortly.\n\nIncase you want to close the ticket, please  use the button down below!"
			)
			.setColor(2292922)
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("close")
				.setEmoji("🔒")
				.setLabel("Close")
				.setStyle(ButtonStyle.Danger)
		);

		channel.send({
			content: "<@!148827597139214336>",
			embeds: [replyEmbed],
			components: [row],
		});

		await interaction.reply({
			content: "Your ticket has been created! <#" + channel.id + ">",
			ephemeral: true,
		});
		return;
	},
};

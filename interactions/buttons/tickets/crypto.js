/**
 * @file Sample button interaction
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 3.2.2
 */

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Schema = require("../../../models/tickets.js");

/**
 * @type {import('../../../typings.js').ButtonInteractionCommand}
 */
module.exports = {
	id: "crypto",

	async execute(interaction) {
		const data = await Schema.findOne({
			ChannelID: interaction.channel.id,
		});

		if (!data)
			return interaction.reply({
				content: "This channel is not a ticket channel.",
				ephemeral: true,
			});

		if (data.PaymentType !== "None")
			return interaction.reply({
				content: "You have already chosen a payment method.",
				ephemeral: true,
			});

		const channel = interaction.guild.channels.cache.get(data.ChannelID);

		const replyEmbed = new EmbedBuilder()
			.setTitle("Crypto Payments")
			.setDescription(
				"Crypto payments are currently unavailable. Please choose another payment method.\n\nI am very sorry for the inconvenience!"
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

		channel.send({
			embeds: [replyEmbed],
		});

		await interaction.reply({
			content: "You chose Crypto as your payment method.",
			ephemeral: true,
		});
		return;
	},
};

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
	id: "paypal",

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

		data.PaymentType = "PayPal";
		data.save();

		const replyEmbed = new EmbedBuilder()
			.setTitle("PayPal Rules")
			.setDescription(
				"In order to pay with PayPal, you must follow these rules.\n\n:one: Always send the money in `Euro (€)`.\n:two: Always send the money as `Friends & Family`.\n:three: Always include your ticket ID `" +
					data.ChannelID +
					"` in the notes of your payment.\n\n**If you fail to follow these rules, we cannot offer refunds for your payment.**\n\n**If you agree to these rules, please click the button below.**"
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
				.setCustomId("paypal_agree")
				.setEmoji("✅")
				.setLabel("Agree")
				.setStyle("3")
		);

		channel.send({
			embeds: [replyEmbed],
			components: [row],
		});

		await interaction.reply({
			content: "You chose PayPal as your payment method.",
			ephemeral: true,
		});
		return;
	},
};

/**
 * @file Sample help command with slash command.
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 1.0.0
 */

// Deconstructed the constants we need in this file.

const {
	EmbedBuilder,
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	PermissionFlagsBits,
} = require("discord.js");

const Schema = require("../../../models/tickets.js");

/**
 * @type {import('../../../typings.js').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("payments")
		.setDescription("Create a payment flow for the ticket.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option
				.setName("amount")
				.setDescription("The amount needed to be paid.")
				.setRequired(true)
		),
	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

		const data = await Schema.findOne({
			ChannelID: interaction.channel.id,
		});

		const amount = interaction.options.getString("amount");

		if (!data)
			return interaction.reply({
				content: "This channel is not a ticket channel.",
				ephemeral: true,
			});

		data.Amount = amount;
		data.save();

		const embed = new EmbedBuilder()
			.setTitle("Payment")
			.setDescription(
				"Your payment total is: `" +
					amount +
					"€`\n\nPlease choose which payment method you would like to use.\n\n**Note:** Revolut supports Credit Card, Apple Pay and Google Pay."
			)
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setColor(2292922)
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			);

		const row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("paypal")
				.setLabel("PayPal")
				.setStyle("3")
				.setEmoji("<:paypal:1109173824420851753>"),
			new ButtonBuilder()
				.setCustomId("revolut")
				.setLabel("Revolut")
				.setStyle("3")
				.setEmoji("<:revolut:1109173814035759125>"),
			new ButtonBuilder()
				.setCustomId("crypto")
				.setLabel("Crypto")
				.setStyle("3")
				.setEmoji("<:crypto:1109173891768791112>"),
		]);

		await interaction.channel.send({ embeds: [embed], components: [row] });

		interaction.reply({
			content: "Sent the payment embed.",
			ephemeral: true,
		});
	},
};

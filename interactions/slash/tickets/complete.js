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
	PermissionFlagsBits,
} = require("discord.js");

const Schema = require("../../../models/tickets.js");
const discountSchema = require("../../../models/discounts.js");

/**
 * @type {import('../../../typings.js').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("complete")
		.setDescription("Complete a payment for a ticket.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

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

		data.Status = "Completed";
		data.save();

		const code = Math.random().toString(36).substring(2, 16).toUpperCase();

		new discountSchema({
			UserID: data.UserID,
			DiscountCode: code,
			DiscountAmount: 10,
			DiscountType: "Percentage",
		}).save();

		const transcriptEmebd = new EmbedBuilder()
			.setTitle("Payment Confirmed")
			.setDescription(
				"Your payment has been confirmed!\nYou have been added to the <@&1101451826601148456> role.\n\nAs a thank you for your purchase, you receive a `10% discount` on your next purchase:\n`" +
					code +
					"`"
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

		await channel.send({
			embeds: [transcriptEmebd],
		});

		await interaction.reply({
			content: "The payment has been marked as complete!",
			ephemeral: true,
		});
		return;
	},
};

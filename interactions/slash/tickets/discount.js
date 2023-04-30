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

const discountSchema = require("../../../models/discounts.js");

/**
 * @type {import('../../../typings.js').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("discount")
		.setDescription("Generate a discount code for a user.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user the discount should be given to.")
				.setRequired(true)
		)
		.addNumberOption((option) =>
			option
				.setName("amount")
				.setDescription("The amount of the discount.")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("The type of the discount.")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

		const code = Math.random().toString(36).substring(2, 16).toUpperCase();

		const user = interaction.options.getUser("user");
		const amount = interaction.options.getNumber("amount");
		const type = interaction.options.getString("type");

		console.log(user, amount, type, code);
		new discountSchema({
			UserID: user.id,
			DiscountCode: code,
			DiscountAmount: amount,
			DiscountType: type,
		})
			.save()
			.catch((err) => console.log(err));

		const transcriptEmebd = new EmbedBuilder()
			.setTitle("Discount Code granted!")
			.setDescription(
				"You have been granted a discount code!\n\nAmount: `" +
					amount +
					"`\nType:`" +
					type +
					"`\nCode: `" +
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

		await user.send({ embeds: [transcriptEmebd] });

		await interaction.reply({
			content: "The discount code has been generated and granted!",
			ephemeral: true,
		});
		return;
	},
};

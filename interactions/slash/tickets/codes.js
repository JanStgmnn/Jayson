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
		.setName("codes")
		.setDescription("Get a discount code by user or code.")
		.addUserOption((option) =>
			option.setName("user").setDescription("The user.")
		)
		.addStringOption((option) =>
			option.setName("code").setDescription("The code.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

		const user = interaction.options.getUser("user");
		const inptCode = interaction.options.getString("code");

		if (!user && !inptCode)
			return interaction.reply({
				content: "Please provide a user or code.",
				ephemeral: true,
			});

		if (!user) {
			const data = await discountSchema.findOne({ DiscountCode: inptCode });

			if (!data)
				return interaction.reply({
					content: "No code found.",
				});

			const codeUser = await interaction.client.users.fetch(data.UserID);
			const amount = data.DiscountAmount;
			const type = data.DiscountType;
			const code = data.DiscountCode;

			const transcriptEmebd = new EmbedBuilder()
				.setTitle("Discount Code found!")
				.setDescription(
					"Found the discount code!\n\nUser: <@!" +
						codeUser.id +
						">\nAmount: `" +
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

			await interaction.reply({
				embeds: [transcriptEmebd],
			});
		} else {
			const data = await discountSchema.find({ UserID: user.id });

			if (!data)
				return interaction.reply({
					content: "No code found for this user.",
				});

			const transcriptEmebd = new EmbedBuilder()
				.setTitle("Discount Code found!")
				.setDescription("Found discount codes for that user!")
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

			for (const entry of data) {
				const codeUser = await interaction.client.users.fetch(entry.UserID);
				const amount = entry.DiscountAmount;
				const type = entry.DiscountType;
				const code = entry.DiscountCode;

				transcriptEmebd.addFields({
					name: "Discount Code",
					value:
						"User: <@!" +
						codeUser.id +
						">\nAmount: `" +
						amount +
						"`\nType:`" +
						type +
						"`\nCode: `" +
						code +
						"`",
				});
			}
			await interaction.reply({
				embeds: [transcriptEmebd],
			});
		}
		return;
	},
};

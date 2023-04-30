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
		.setName("finish")
		.setDescription("Finish off a ticket.")
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
				content: "This channel is not a ticket channel.",
				ephemeral: true,
			});

		const embed = new EmbedBuilder()
			.setTitle("Project Completed")
			.setDescription(
				"Thank you for working with me!\nI hope to work with you again in the near future.\n\n**If you were satisfied with my work, please consider leaving a review, by using the command `/testimonial`.**"
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

		await interaction.channel.send({ embeds: [embed] });

		interaction.reply({
			content: "Sent the payment embed.",
			ephemeral: true,
		});
	},
};

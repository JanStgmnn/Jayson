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
	TextInputStyle,
	TextInputBuilder,
	BaseSelectMenuBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ModalBuilder,
} = require("discord.js");

const Schema = require("../../../models/office.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("testimonial")
		.setDescription("Create a testimonial for a previous purchase.")
		.setDefaultMemberPermissions(PermissionFlagsBits.PrioritySpeaker),
	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

		const stars = new StringSelectMenuBuilder()
			.setCustomId("testimonial_stars")
			.setPlaceholder("Select a rating")
			.addOptions([
				new StringSelectMenuOptionBuilder().setLabel("⭐").setValue("1"),
				new StringSelectMenuOptionBuilder().setLabel("⭐⭐").setValue("2"),
				new StringSelectMenuOptionBuilder().setLabel("⭐⭐⭐").setValue("3"),
				new StringSelectMenuOptionBuilder().setLabel("⭐⭐⭐⭐").setValue("4"),
				new StringSelectMenuOptionBuilder()
					.setLabel("⭐⭐⭐⭐⭐")
					.setValue("5")
					.setDefault(true),
			]);

		const secondRow = new ActionRowBuilder().addComponents(stars);

		interaction.reply({
			content: "Please choose your rating:",
			components: [secondRow],
			ephemeral: true,
		});
	},
};

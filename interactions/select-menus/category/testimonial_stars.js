/**
 * @file Sample Select-Menu interaction
 * @author Naman Vrati
 * @since 3.0.0
 * @version 3.2.2
 */

const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");

const Schema = require("../../../models/testimonial.js");

/**
 * @type {import('../../../typings').SelectInteractionCommand}
 */
module.exports = {
	id: "testimonial_stars",

	async execute(interaction) {
		let stars = interaction.values[0];

		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});

		if (!data) {
			new Schema({
				UserID: interaction.user.id,
				Stars: stars,
			}).save();
		} else {
			data.Stars = stars;
			data.save();
		}

		const textInput = new TextInputBuilder()
			.setCustomId("testimonial_text")
			.setPlaceholder("I gave the developer " + stars + " stars because...")
			.setLabel("Review:")
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(textInput);

		const modal = new ModalBuilder()
			.setCustomId("testimonial_modal")
			.setTitle(stars + " Star Review")
			.addComponents(firstActionRow);

		return await interaction.showModal(modal);
	},
};

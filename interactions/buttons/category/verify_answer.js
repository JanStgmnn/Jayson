/**
 * @file Sample button interaction
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 3.2.2
 */

const { createCaptchaSync } = require("captcha-canvas");
const {
	AttachmentBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");
const { writeFileSync } = require("fs");
const Schema = require("../../../models/verification.js");

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
	id: "verify_answer",

	async execute(interaction) {
		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});

		const answerInput = new TextInputBuilder()
			.setCustomId("verify_answer_input")
			.setPlaceholder("Enter your answer here")
			.setLabel("Answer:")
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder().addComponents(answerInput);

		const modal = new ModalBuilder()
			.setCustomId("verify_modal")
			.setTitle("Verification")
			.addComponents(firstActionRow);

		await interaction.showModal(modal);
	},
};

/**
 * @file Sample button interaction
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 3.2.2
 */

const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	PermissionFlagsBits,
	ChannelType,
	ButtonStyle,
	UserSelectMenuBuilder,
} = require("discord.js");
const Schema = require("../../../models/tournament.js");
const playerSchema = require("../../../models/player.js");

/**
 * @type {import('../../../typings.js').ButtonInteractionCommand}
 */
module.exports = {
	id: "winner",

	async execute(interaction) {
		const data = await Schema.findOne();

		if (!data)
			return interaction.reply({
				content:
					"There is no tournament, please create one using `/tournament`!",
				ephemeral: true,
			});

		if (data.tournamentowner !== interaction.user.id)
			return interaction.reply({
				content: "You are not the owner of the game!",
				ephemeral: true,
			});

		data.messageID = interaction.message.id;
		await data.save();

		const userSelector = new UserSelectMenuBuilder()
			.setCustomId("winner_sel")
			.setPlaceholder("Select the winner");

		const row = new ActionRowBuilder().addComponents(userSelector);

		await interaction.reply({
			content: "Please select the winner of the tournament!",
			components: [row],
			ephemeral: true,
		});
	},
};

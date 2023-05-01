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
} = require("discord.js");
const Schema = require("../../../models/tournament.js");

/**
 * @type {import('../../../typings.js').ButtonInteractionCommand}
 */
module.exports = {
	id: "join",

	async execute(interaction) {
		const data = await Schema.findOne();

		if (!data)
			return interaction.reply({
				content:
					"There is no tournament, please create one using `/tournament`!",
				ephemeral: true,
			});

		if (data.players.includes(interaction.user.id))
			return interaction.reply({
				content: "You are already in the tournament!",
				ephemeral: true,
			});

		data.players.push(interaction.user.id);
		await data.save();

		const tournamentEmebd = new EmbedBuilder()
			.setTitle("Tournament")
			.setDescription(
				"The games for the tournament have been selected. If you want to play, please join by clicking the button down below!"
			)
			.addFields({
				name: "Players",
				value: data.players.map((player) => `<@${player}>`).join("\n"),
				inline: true,
			})
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setColor(2292922)
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			);

		const games = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("join")
				.setLabel("Join")
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId("next")
				.setLabel("Start")
				.setStyle(ButtonStyle.Primary),
		]);

		await interaction.message.edit({
			embeds: [tournamentEmebd],
			components: [games],
		});

		await interaction.reply({
			content: "You have joined the tournament!",
			ephemeral: true,
		});
	},
};

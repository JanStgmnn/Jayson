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
const playerSchema = require("../../../models/player.js");

/**
 * @type {import('../../../typings.js').ButtonInteractionCommand}
 */
module.exports = {
	id: "team1",

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
				content: "You are not the owner of the tournament!",
				ephemeral: true,
			});

		const points = data.pointsgranted;
		const players = data.team1;
		console.log(data.team1);

		const tournamentEmebd = new EmbedBuilder()
			.setTitle("Team 1 are the winners!")
			.setDescription(
				"Congratulations to team 1 for winning this game!\n\nEveryone in Team 1 received `" +
					points +
					" points`!"
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

		const row = new ActionRowBuilder();
		if (data.currgame == data.gamelist.length) {
			row.addComponents([
				new ButtonBuilder()
					.setCustomId("next")
					.setLabel("See Results")
					.setStyle(ButtonStyle.Primary),
			]);
		} else {
			console.log(data.currgame);
			console.log(data.gamelist.length);
			row.addComponents([
				new ButtonBuilder()
					.setCustomId("next")
					.setLabel("Next Game")
					.setStyle(ButtonStyle.Primary),
			]);
		}

		for (player in players) {
			var player = players[player];
			console.log(player);
			const data = await playerSchema.findOne({ UserID: player });

			if (!data) {
				const newData = new playerSchema({
					UserID: player,
					points: points,
				});
				await newData.save();
			} else {
				data.points += points;
				await data.save();
			}
		}

		await interaction.message.edit({
			embeds: [tournamentEmebd],
			components: [row],
		});

		await interaction.deferUpdate();
	},
};

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
	Message,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const Schema = require("../../../models/tournament.js");
const playerSchema = require("../../../models/player.js");

/**
 * @type {import('../../../typings').SelectInteractionCommand}
 */
module.exports = {
	id: "winner_sel",

	async execute(interaction) {
		console.log(interaction);
		const user = interaction.users.first();

		const data = await Schema.findOne();

		if (!data)
			return interaction.reply({
				content:
					"There is no tournament, please create one using `/tournament`!",
				ephemeral: true,
			});

		const points = data.pointsgranted;

		const tournamentEmebd = new EmbedBuilder()
			.setTitle(user.username + " is the winners!")
			.setDescription(
				"Congratulations on winning this game!\n\nYou received `" +
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
			row.addComponents([
				new ButtonBuilder()
					.setCustomId("next")
					.setLabel("Next Game")
					.setStyle(ButtonStyle.Primary),
			]);
		}

		const playerdata = await playerSchema.findOne({ UserID: user.id });

		if (!playerdata) {
			const newData = new playerSchema({
				UserID: user.id,
				points: points,
			});
			await newData.save();
		} else {
			playerdata.points += points;
			await playerdata.save();
		}

		const msg = await interaction.channel.messages
			.fetch(data.messageID)
			.then((msg) => msg.delete());

		await interaction.channel.send({
			embeds: [tournamentEmebd],
			components: [row],
		});

		await interaction.deferUpdate();
	},
};

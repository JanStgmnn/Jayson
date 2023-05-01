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
	id: "helloneighbour",

	async execute(interaction) {
		const data = await Schema.findOne();

		if (!data)
			return interaction.reply({
				content:
					"There is no tournament, please create one using `/tournament`!",
				ephemeral: true,
			});

		data.games.helloneighbour = !data.games.helloneighbour;
		if (data.games.helloneighbour) {
			data.gamelist.push("helloneighbour");
		} else {
			data.gamelist.splice(data.gamelist.indexOf("helloneighbour"), 1);
		}
		data.save();

		const tournamentEmebd = new EmbedBuilder()
			.setTitle("Tournament")
			.setDescription(
				"Welcome to the tournament! Please select the games you want to play."
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

		const games = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("witchit")
				.setLabel("Witch It")
				.setStyle(
					data.games.witchit ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("cardsagainsthumanity")
				.setLabel("Cards Against Humanity")
				.setStyle(
					data.games.cardsagainsthumanity
						? ButtonStyle.Success
						: ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("skribbl")
				.setLabel("Skribbl.io")
				.setStyle(
					data.games.skribbl ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("garticphone")
				.setLabel("Gartic Phone")
				.setStyle(
					data.games.garticphone ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("ttt")
				.setLabel("TTT")
				.setStyle(data.games.ttt ? ButtonStyle.Success : ButtonStyle.Danger),
		]);

		const games2 = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("stadtlandfluss")
				.setLabel("Stadt Land Fluss")
				.setStyle(
					data.games.stadtlandfluss ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("ultimatechickenhorse")
				.setLabel("Ultimate Chicken Horse")
				.setStyle(
					data.games.ultimatechickenhorse
						? ButtonStyle.Success
						: ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("siedlervoncatan")
				.setLabel("Siedler von Catan")
				.setStyle(
					data.games.siedlervoncatan ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("uno")
				.setLabel("Uno")
				.setStyle(data.games.uno ? ButtonStyle.Success : ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId("monopoly")
				.setLabel("Monopoly")
				.setStyle(
					data.games.monopoly ? ButtonStyle.Success : ButtonStyle.Danger
				),
		]);

		const games3 = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("codenames")
				.setLabel("Codenames")
				.setStyle(
					data.games.codenames ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("secrethitler")
				.setLabel("Secrethitler")
				.setStyle(
					data.games.secrethitler ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("werwolf")
				.setLabel("Werwolf")
				.setStyle(
					data.games.werwolf ? ButtonStyle.Success : ButtonStyle.Danger
				),
			new ButtonBuilder()
				.setCustomId("helloneighbour")
				.setLabel("Hello Neighbour")
				.setStyle(
					data.games.helloneighbour ? ButtonStyle.Success : ButtonStyle.Danger
				),
		]);

		const games4 = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("submit")
				.setLabel("Submit")
				.setStyle(ButtonStyle.Primary),
		]);

		await interaction.message.edit({
			embeds: [tournamentEmebd],
			components: [games, games2, games3, games4],
		});

		return interaction.deferUpdate();
	},
};

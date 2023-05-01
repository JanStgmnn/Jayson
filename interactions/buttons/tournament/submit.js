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
	id: "submit",

	async execute(interaction) {
		const data = await Schema.findOne();

		if (!data)
			return interaction.reply({
				content:
					"There is no tournament, please create one using `/tournament`!",
				ephemeral: true,
			});

		if (data.tournamentowner !== interaction.user.id) {
			return interaction.reply({
				content: "You are not the owner of the tournament!",
				ephemeral: true,
			});
		}

		data.gamelist = [];
		for (game in data.games) {
			//filter out mongoose funtions
			if (game.startsWith("$")) continue;
			if (game.startsWith("on")) continue;
			if (game.startsWith("emit")) continue;
			if (game.startsWith("add")) continue;
			if (game.startsWith("to")) continue;
			if (game.startsWith("update")) continue;
			if (game.startsWith("replace")) continue;
			if (game.startsWith("overwrite")) continue;
			if (game.startsWith("set")) continue;
			if (game.startsWith("get")) continue;
			if (game.startsWith("mark")) continue;
			if (game.startsWith("direct")) continue;
			if (game.startsWith("dep")) continue;
			if (game.startsWith("unm")) continue;
			if (game.includes("istener")) continue;
			if (game.includes("init")) continue;
			if (game.startsWith("is")) continue;
			if (game.startsWith("mod")) continue;
			if (game.startsWith("val")) continue;
			if (game.startsWith("parent")) continue;
			if (game.startsWith("eq")) continue;
			if (game.startsWith("pop")) continue;
			if (game.startsWith("insp")) continue;
			if (game.startsWith("inv")) continue;
			if (game.startsWith("owner")) continue;
			if (data.games[game]) {
				data.gamelist.push(game);
			}
		}

		console.log(data.gamelist);
		data.gamelist.sort(() => Math.random() - 0.5);

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

		var str = "";
		for (game in data.gamelist) {
			var name = "";
			game = data.gamelist[game];
			switch (game) {
				case "witchit":
					name = "Witch It";
					desc =
						"Witch It is a multiplayer hide & seek game. Brave hunters seek hidden witches in a humorous, magical world.\n\nThis game is a Team Game, Hiders vs Seekers. See your teams down below!";
					type = "team";
					teamnames = ["Hiders", "Seekers"];
					break;
				case "cardsagainsthumanity":
					name = "Cards Against Humanity";
					desc =
						"Cards Against Humanity is a party game for horrible people. Unlike most of the party games you've played before, Cards Against Humanity is as despicable and awkward as you and your friends.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "skribbl":
					name = "Skribbl.io";
					desc =
						"Skribbl.io is a free multiplayer drawing and guessing game. One game consists of a few rounds in which every round someone has to draw their chosen word and others have to guess it to gain points!\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "garticphone":
					name = "Gartic Phone";
					desc =
						"Gartic Phone is a game where players write a sentence, pass it to the next player, who draws a picture representing that sentence. The next player then writes a sentence to describe that drawing, and so on.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "ttt":
					name = "TTT";
					desc =
						"TTT is a game where you have to find out who the traitors are. The traitors have to kill all the innocents, while the innocents have to find out who the traitors are and kill them.\n\nThis game is a Team Game, Traitors vs Innocents. See your teams down below!";
					type = "team";
					teamnames = ["Traitors", "Innocents"];
					break;
				case "stadtlandfluss":
					name = "Stadt Land Fluss";
					desc =
						"Stadt Land Fluss is a game where you have to find words for a given letter in different categories. The first one to finish wins!\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "ultimatechickenhorse":
					name = "Ultimate Chicken Horse";
					desc =
						"Ultimate Chicken Horse is a party platformer game where you build the level as you play, placing traps and hazards to screw your friends over, but trying not to screw yourself.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "siedlervoncatan":
					name = "Siedler von Catan";
					desc =
						"Siedler von Catan is a game where you have to build a settlement and try to get as many points as possible. You can get points by building settlements, cities, roads and by having the longest road or the biggest army.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "uno":
					name = "Uno";
					desc =
						"Uno is a game where you have to get rid of all your cards. You can do that by placing a card with the same color or number as the card on the stack. You can also place special cards, which have different effects.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "monopoly":
					name = "Monopoly";
					desc =
						"Monopoly is a game where you have to buy as many streets as possible and build houses and hotels on them. If someone lands on your street, they have to pay you money. The first one to go bankrupt loses.\n\nThis game is a Singleplayer game!";
					type = "single";
					break;
				case "codenames":
					name = "Codenames";
					desc =
						"Codenames is a game where you have to guess the words of your team. You can only give one word and one number to your team. The number is the amount of words that are related to the word you gave.\n\nThis game is a Team Game, Red vs Blue. See your teams down below!";
					type = "team";
					teamnames = ["Red", "Blue"];
					break;
				case "secrethitler":
					name = "Secret Hitler";
					desc =
						"Secret Hitler is a game where you become fascist or liberal. Your goal is to competitively enact your policies.\n\nThis game is a Team Game, Liberals vs Fascist. See your teams down below!";
					type = "team";
					teamnames = ["Facists", "Liberals"];
					break;
				case "werwolf":
					name = "Werwolf";
					desc =
						"Werwolf is a game where you become a werewolf or a villager. Your goal is to kill all the werewolves or all the villagers.\n\nThis game is a Team Game, Werewolves vs Villagers. See your teams down below!";
					type = "team";
					teamnames = ["Werewolves", "Villagers"];
					break;
				case "helloneighbour":
					name = "Hello Neighbour";
					desc =
						"Hello Neighbour is a game where you have to find out who the neighbour is. The neighbour has to kill all the kids, while the kids have to find out who the neighbour is and kill him.\n\nThis game is a Team Game, Neighbour vs Kids. See your teams down below!";
					type = "team";
					teamnames = ["Neighbour", "Kids"];
					break;
			}
			str += name + "\n";
		}

		tournamentEmebd.addFields({
			name: "Games",
			value: str,
			inline: true,
		});

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

		return interaction.deferUpdate();
	},
};

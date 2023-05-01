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
	id: "next",

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

		if (data.currgame >= data.gamelist.length) {
			let players = await playerSchema.find().sort({ points: -1 });

			const embed = new EmbedBuilder()
				.setTitle("Tournament finished!")
				.setDescription(
					"Congratulations to the winner of the tournament, <@" +
						players[0].UserID +
						"> with `" +
						players[0].points +
						"` points!\n\nYou have received the role <@&1102601918959857785>!"
				)
				.setColor(2292922)
				.setFooter({
					text: "crazii Solutions",
					iconURL:
						"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
				})
				.setImage(
					"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
				);

			const allplayers = players.map((p) => `<@${p.UserID}>`).join("\n");
			const allpoints = players.map((p) => `${p.points}`).join("\n");

			let role = interaction.guild.roles.cache.get("1102601918959857785");

			interaction.guild.roles.cache
				.get("1102601918959857785")
				.members.map((m) => m.roles.remove(role));

			let member = interaction.guild.members.cache.get(players[0].UserID);
			console.log(players);
			member.roles.add(role);

			data.players = [];
			data.gamelist = [];
			data.pointsgranted = 0;
			data.currgame = 0;
			data.team1 = [];
			data.team2 = [];
			data.running = false;
			await data.save();

			await playerSchema.deleteMany();

			await interaction.message.edit({
				embeds: [embed],
				components: [],
			});

			const leaderboard = new EmbedBuilder()
				.setTitle("Leaderboard")
				.setDescription("Here is the leaderboard of the tournament!:")
				.setColor(2292922)
				.setFooter({
					text: "crazii Solutions",
					iconURL:
						"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
				})
				.setImage(
					"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
				)
				.addFields([
					{
						name: "Players",
						value: allplayers,
						inline: true,
					},
					{
						name: "Points",
						value: allpoints,
						inline: true,
					},
				]);

			interaction.channel.send({ embeds: [leaderboard] });

			return;
		}

		const game = data.gamelist[data.currgame];
		const gamenumber = data.currgame + 1;
		data.currgame = gamenumber;

		if (data.pointsgranted == 0) data.pointsgranted = 1;
		else data.pointsgranted = data.pointsgranted * 2;

		const points = data.pointsgranted;

		await data.save();

		var name = "";
		var desc = "";
		var type = "";
		var teamnames = [];
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

		var tournamentEmebd = new EmbedBuilder()
			.setTitle("Game #" + gamenumber + " | " + name)
			.setDescription(
				desc + "\n\n**Select the winners by clicking the button down below!**"
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

		if (type == "team") {
			const numberofteams = teamnames.length;
			const numberofplayers = data.players.length;
			const playersperTeam = Math.floor(numberofplayers / numberofteams);
			const playersleft = numberofplayers % numberofteams;
			const team1 = playersperTeam + playersleft;
			const team2 = playersperTeam;

			data.players.sort(() => Math.random() - 0.5);

			let team1players = data.players.slice(0, team1);
			let team2players = data.players.slice(team1, team1 + team2);

			data.team1 = [];
			data.team2 = [];

			for (player in team1players) {
				data.team1.push(team1players[player]);
			}

			for (player in team2players) {
				data.team2.push(team2players[player]);
			}

			await data.save();

			const team1string = team1players
				.map((player) => `<@${player}>`)
				.join("\n");
			const team2string = team2players
				.map((player) => `<@${player}>`)
				.join("\n");

			tournamentEmebd.addFields({
				name: teamnames[0],
				value: team1string + " ",
				inline: true,
			});

			tournamentEmebd.addFields({
				name: teamnames[1],
				value: team2string + " ",
				inline: true,
			});

			console.log(teamnames);

			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("team1")
					.setLabel(teamnames[0])
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId("team2")
					.setLabel(teamnames[1])
					.setStyle(ButtonStyle.Success),
			]);

			await interaction.message.edit({
				embeds: [tournamentEmebd],
				components: [row],
			});
		} else {
			const row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setCustomId("winner")
					.setLabel("Select Winner")
					.setStyle(ButtonStyle.Primary),
			]);

			await interaction.message.edit({
				embeds: [tournamentEmebd],
				components: [row],
			});
		}

		await interaction.deferUpdate();
	},
};

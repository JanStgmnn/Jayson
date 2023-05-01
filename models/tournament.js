const mongo = require("mongoose");

const Schema = new mongo.Schema({
	running: Boolean,
	games: {
		witchit: {
			type: Boolean,
			default: false,
		},
		cardsagainsthumanity: {
			type: Boolean,
			default: false,
		},
		skribbl: {
			type: Boolean,
			default: false,
		},
		garticphone: {
			type: Boolean,
			default: false,
		},
		ttt: {
			type: Boolean,
			default: false,
		},
		stadtlandfluss: {
			type: Boolean,
			default: false,
		},
		ultimatechickenhorse: {
			type: Boolean,
			default: false,
		},
		siedlervoncatan: {
			type: Boolean,
			default: false,
		},
		uno: {
			type: Boolean,
			default: false,
		},
		monopoly: {
			type: Boolean,
			default: false,
		},
		codenames: {
			type: Boolean,
			default: false,
		},
		secrethitler: {
			type: Boolean,
			default: false,
		},
		werwolf: {
			type: Boolean,
			default: false,
		},
		helloneighbour: {
			type: Boolean,
			default: false,
		},
	},
	players: [String],
	gamelist: [String],
	pointsgranted: Number,
	leaderboard: Map,
	currgame: Number,
	team1: [String],
	team2: [String],
	tournamentowner: String,
	messageID: String,
});

module.exports = mongo.model("tournament", Schema);

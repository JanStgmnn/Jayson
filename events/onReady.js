const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

/**
 * @file Ready Event File.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.2.2
 */

const { mongo_url } = require("./../config.json");
const mongoose = require("mongoose");

module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes when client is ready (bot initialization).
	 * @param {import('../typings').Client} client Main Application Client.
	 */
	execute(client) {
		client.user.setPresence({
			activities: [{ name: `commands!`, type: ActivityType.Listening }],
			status: "online",
		});
		console.log(`Ready! Logged in as ${client.user.tag}`);
		mongoose
			.connect(mongo_url, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(console.log("Connected to Mongodb."));
	},
};

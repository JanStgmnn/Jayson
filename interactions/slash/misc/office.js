/**
 * @file Sample help command with slash command.
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 1.0.0
 */

// Deconstructed the constants we need in this file.

const {
	EmbedBuilder,
	SlashCommandBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	PermissionFlagsBits,
} = require("discord.js");

const Schema = require("../../../models/office.js");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("office")
		.setDescription("Used by admins to create office times")
		.addBooleanOption((option) =>
			option
				.setName("currently")
				.setDescription("Set if the office hours are currently active")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		if (interaction.user.id === "148827597139214336") {
			let bool = interaction.options.getBoolean("currently");

			const data = await Schema.findOne({});
			if (data) {
				const officeEmbed = new EmbedBuilder()
					.setTitle("Office Hours")
					.setDescription(
						"`Mon-Fri:` <t:1682672400:t> - <t:1682715600:t>\n`Sat & Sun:` <t:1682676000:t> - <t:1682640000:t>"
					)
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					})
					.setColor(2292922)
					.addFields({
						name: "Currently",
						value: bool
							? ":green_circle: Currently in office"
							: ":red_circle: Currently not in office",
					})
					.setImage(
						"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
					);

				const channel = interaction.client.channels.cache.get(
					"1101441440271306762"
				);
				const message_to_change = await channel.messages.fetch(
					data.OfficeHours
				);
				message_to_change.edit({ embeds: [officeEmbed] });
				interaction.reply({
					content: "Office hours updated",
					ephemeral: true,
				});
			} else {
				const officeEmbed = new EmbedBuilder()
					.setTitle("Office Hours")
					.setDescription(
						"`Mon-Fri:` <t:1682672400:t> - <t:1682715600:t>\n`Sat & Sun:` <t:1682676000:t> - <t:1682640000:t>"
					)
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					})
					.setColor(2292922)
					.addFields({
						name: "Currently",
						value: bool
							? ":green_circle: Currently in office"
							: ":red_circle: Currently not in office",
					})
					.setImage(
						"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
					);

				interaction.channel.send({ embeds: [officeEmbed] }).then((msg) => {
					var s = new Schema({ OfficeHours: msg.id }).save();
				});
			}
		}
	},
};

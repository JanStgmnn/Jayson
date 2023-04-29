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

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("createinteraction")
		.setDescription("Used by admins to create interactions")
		.addStringOption((option) =>
			option
				.setName("interaction")
				.setDescription("The specific interaction to spawn.")
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString("interaction");

		if (!name) {
			return interaction.reply({
				content: "Please enter an interaction name",
				ephemeral: true,
			});
		} else {
			name = name.toLowerCase();

			switch (name) {
				case "verification":
					const verificationEmbed = new EmbedBuilder()
						.setTitle("Verification")
						.setDescription(
							"To access the server, please verify yourself by clicking the button below."
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

					const verificationRow = new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId("verify")
							.setLabel("Verify")
							.setStyle("3")
					);
					await interaction.guild.channels.cache
						.get("1101204733571633262")
						.send({
							embeds: [verificationEmbed],
							components: [verificationRow],
						});
					interaction.reply({
						content: "Verification interaction created",
						ephemeral: true,
					});
					break;
			}
		}
	},
};

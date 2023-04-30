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
				.setRequired(true)
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
				case "tickets":
					const ticketEmbedOne = new EmbedBuilder()
						.setTitle("Contact Us")
						.setDescription(
							"In order to purchase and get more detailed information about my services, please open a ticket.\n\nTo open a ticket, click the according button down below."
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

					const ticketEmbedOneRow = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId("order_discord")
							.setLabel("Discord Bots")
							.setStyle("3")
							.setEmoji("<:discord:831885286232686613>"),
						new ButtonBuilder()
							.setCustomId("order_desktop")
							.setLabel("Desktop Applications")
							.setStyle("3")
							.setEmoji("🖥️"),
						new ButtonBuilder()
							.setCustomId("order_scripts")
							.setLabel("Scripts")
							.setStyle("3")
							.setEmoji("📜"),
						new ButtonBuilder()
							.setCustomId("support")
							.setLabel("General Support")
							.setStyle("3")
							.setEmoji("📨"),
					]);

					await interaction.guild.channels.cache
						.get("1101464182630645810")
						.send({
							embeds: [ticketEmbedOne],
							components: [ticketEmbedOneRow],
						});

					const ticketEmbedTwo = new EmbedBuilder()
						.setTitle("Contact Us")
						.setDescription(
							"If you're having trouble verifying yourself, please open a ticket.\n\nTo open a ticket, click the according button down below."
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

					const ticketEmbedTwoRow = new ActionRowBuilder().addComponents([
						new ButtonBuilder()
							.setCustomId("support")
							.setLabel("General Support")
							.setStyle("3")
							.setEmoji("📨"),
					]);

					await interaction.guild.channels.cache
						.get("1101447810190147724")
						.send({
							embeds: [ticketEmbedTwo],
							components: [ticketEmbedTwoRow],
						});

					interaction.reply({
						content: "Ticket interaction created",
						ephemeral: true,
					});
					break;
			}
		}
	},
};

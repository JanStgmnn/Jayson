/**
 * @file Sample button interaction
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 3.2.2
 */

const { createCaptchaSync } = require("captcha-canvas");
const {
	AttachmentBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} = require("discord.js");
const { writeFileSync } = require("fs");
const Schema = require("../../../models/verification.js");

/**
 * @type {import('../../../typings').ButtonInteractionCommand}
 */
module.exports = {
	id: "verify",

	async execute(interaction) {
		const { image, text } = createCaptchaSync(300, 100);

		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});

		if (data) {
			if (data.Verified === true) {
				const verifiedEmbed = new EmbedBuilder()
					.setTitle("You are already verified!")
					.setDescription(
						"As you are already verified the role <@&1101426840784097330> has been added to you!"
					)
					.setColor(2292922)
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					});

				interaction.member.roles.add("1101426840784097330");

				return interaction.reply({
					embeds: [verifiedEmbed],
					ephemeral: true,
				});
			} else {
				if (data.blocked > Math.floor(Date.now() / 1000)) {
					const blockedEmbed = new EmbedBuilder()
						.setTitle("You are blocked!")
						.setDescription(
							"You are blocked from verifying for until <t:" +
								data.blocked +
								">! Please wait!"
						)
						.setColor("#FF6961")
						.setFooter({
							text: "crazii Solutions",
							iconURL:
								"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
						});

					return interaction.reply({
						embeds: [blockedEmbed],
						ephemeral: true,
					});
				}

				data.Answer = text;
				data.save();

				const attachment = new AttachmentBuilder(image, {
					name: "captcha.png",
				});

				const actionRow = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId("verify_answer")
						.setLabel("Answer")
						.setStyle("3")
				);

				const replyEmbed = new EmbedBuilder()
					.setTitle("Please solve this Captcha :robot:")
					.setDescription(
						"To access this server and prove that you are a human, please solve\nthe captcha below.\n\n**NOTE:** This Captcha is CaSe SeNsiTiVe and does not include spaces.\nYou can also generate a new Captcha by clicking the button above."
					)
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					})
					.setImage("attachment://captcha.png")
					.setColor(2292922);

				await interaction.reply({
					embeds: [replyEmbed],
					files: [attachment],
					components: [actionRow],
					ephemeral: true,
				});
				return;
			}
		} else {
			new Schema({
				UserID: interaction.user.id,
				Answer: text,
				Verified: false,
				Try: 0,
				blocked: 0,
				captcha_msg: 0,
			}).save();

			const attachment = new AttachmentBuilder(image, {
				name: "captcha.png",
			});

			const actionRow = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("verify_answer")
					.setLabel("Answer")
					.setStyle("3")
			);

			const replyEmbed = new EmbedBuilder()
				.setTitle("Please solve this Captcha :robot:")
				.setDescription(
					"To access this server and prove that you are a human, please solve\nthe captcha below.\n\n**NOTE:** This Captcha is CaSe SeNsiTiVe and does not include spaces."
				)
				.setFooter({
					text: "crazii Solutions",
					iconURL:
						"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
				})
				.setImage("attachment://captcha.png")
				.setColor(2292922);

			await interaction.reply({
				embeds: [replyEmbed],
				files: [attachment],
				components: [actionRow],
				ephemeral: true,
			});
			return;
		}
	},
};

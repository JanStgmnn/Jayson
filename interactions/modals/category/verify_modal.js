/**
 * @file Sample modal interaction
 * @author Naman Vrati
 * @since 3.2.0
 * @version 3.2.2
 */

const { EmbedBuilder } = require("discord.js");
const Schema = require("../../../models/verification.js");

/**
 * @type {import('../../../typings').ModalInteractionCommand}
 */
module.exports = {
	id: "verify_modal",

	async execute(interaction) {
		const answer = interaction.fields.getTextInputValue("verify_answer_input");

		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});

		if (data) {
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

			if (data.Answer == answer) {
				data.Verified = true;
				data.Try = 0;
				data.blocked = 0;
				data.save();

				interaction.member.roles.add("1101426840784097330");

				const verifiedEmbed = new EmbedBuilder()
					.setTitle("Successfully verified!")
					.setDescription(
						"You solved the captcha correctly! The role <@&1101426840784097330> has been added to you!"
					)
					.setColor(2292922)
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					});

				await interaction.reply({
					embeds: [verifiedEmbed],
					ephemeral: true,
				});
			} else {
				const verifiedEmbed = new EmbedBuilder()
					.setTitle("Verification failed!")
					.setColor("#FF6961")
					.setFooter({
						text: "crazii Solutions",
						iconURL:
							"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
					});

				if (data.blocked != 0) {
					data.blocked = 0;
					data.Try = 0;
				}

				if (data.Try >= 2) {
					verifiedEmbed.setDescription(
						"You failed the verification 3 times! You are now timed out for 5 minutes!"
					);
				} else {
					verifiedEmbed.setDescription(
						"You failed the verification! You have `" +
							(2 - data.Try) +
							"` tries left before being timed out for 5 minutes!"
					);
				}

				data.Verified = false;
				data.Try = data.Try + 1;
				if (data.Try >= 3) {
					data.blocked = Math.floor((Date.now() + 300000) / 1000);
				}
				data.save();

				await interaction.reply({
					embeds: [verifiedEmbed],
					ephemeral: true,
				});
			}
		}

		return;
	},
};

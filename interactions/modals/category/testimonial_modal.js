/**
 * @file Sample modal interaction
 * @author Naman Vrati
 * @since 3.2.0
 * @version 3.2.2
 */

const { EmbedBuilder } = require("discord.js");
const Schema = require("../../../models/testimonial.js");

/**
 * @type {import('../../../typings').ModalInteractionCommand}
 */
module.exports = {
	id: "testimonial_modal",

	async execute(interaction) {
		const answer = interaction.fields.getTextInputValue("testimonial_text");
		const data = await Schema.findOne({
			UserID: interaction.user.id,
		});
		const stars = data.Stars;

		var sendEmbed = new EmbedBuilder()
			.setAuthor({
				name: interaction.user.username + "#" + interaction.user.discriminator,
				iconURL: interaction.user.avatarURL({ dynamic: true }),
			})
			.setColor(2292922)
			.setFooter({
				text: "crazii Solutions",
				iconURL:
					"https://media.discordapp.net/attachments/1101118030630629426/1101118853750206544/crazii-solutions2.png?width=897&height=897",
			})
			.setImage(
				"https://media.discordapp.net/attachments/1101118030630629426/1101118065544015882/Untitled-2.png?width=1200&height=100"
			);

		if (stars == "1") {
			sendEmbed.addFields([
				{ name: "Stars", value: "⭐", inline: false },
				{ name: "Review", value: answer, inline: false },
			]);
		} else if (stars == "2") {
			sendEmbed.addFields([
				{ name: "Stars", value: "⭐⭐", inline: false },
				{ name: "Review", value: answer, inline: false },
			]);
		} else if (stars == "3") {
			sendEmbed.addFields([
				{ name: "Stars", value: "⭐⭐⭐", inline: false },
				{ name: "Review", value: answer, inline: false },
			]);
		} else if (stars == "4") {
			sendEmbed.addFields([
				{ name: "Stars", value: "⭐⭐⭐⭐", inline: false },
				{ name: "Review", value: answer, inline: false },
			]);
		} else if (stars == "5") {
			sendEmbed.addFields([
				{ name: "Stars", value: "⭐⭐⭐⭐⭐", inline: false },
				{ name: "Review", value: answer, inline: false },
			]);
		}

		interaction.client.channels.cache
			.get("1101449091575197708")
			.send({ embeds: [sendEmbed] });

		return interaction.reply({
			content: "Thank you for your review!",
			ephemeral: true,
		});
	},
};

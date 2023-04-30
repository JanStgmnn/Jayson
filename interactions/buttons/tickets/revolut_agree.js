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
	ButtonStyle,
} = require("discord.js");
const Schema = require("../../../models/tickets.js");

/**
 * @type {import('../../../typings.js').ButtonInteractionCommand}
 */
module.exports = {
	id: "revolut_agree",

	async execute(interaction) {
		const data = await Schema.findOne({
			ChannelID: interaction.channel.id,
		});

		if (!data)
			return interaction.reply({
				content: "This channel is not a ticket channel.",
				ephemeral: true,
			});

		if (data.Approval !== false)
			return interaction.reply({
				content: "You have already approved the rules.",
				ephemeral: true,
			});

		const channel = interaction.guild.channels.cache.get(data.ChannelID);

		data.Approval = true;
		data.save();

		const replyEmbed = new EmbedBuilder()
			.setTitle("Revolut Payment")
			.setDescription(
				"Thank you for agreeing to pay with Revolut. Please click the button below to proceed with the payment.\n\nThe total amount of the payment is: `" +
					data.Amount +
					"€`.\n\n**Once the payment has been sent, please send a screenshot of the payment receipt to this channel.**"
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

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setEmoji("<:revolut:873224581261979688>")
				.setLabel("Pay")
				.setStyle(ButtonStyle.Link)
				.setURL("https://revolut.me/crazii")
		);

		channel.send({
			embeds: [replyEmbed],
			components: [row],
		});

		await interaction.reply({
			content: "You agreed to the Revolut rules.",
			ephemeral: true,
		});
		return;
	},
};

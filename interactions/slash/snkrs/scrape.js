/**
 * @file Sample help command with slash command.
 * @author Jan Stegemann
 * @since 3.0.0
 * @version 1.0.0
 */

// Deconstructed the constants we need in this file.
const fetch = require("node-fetch");
const {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionFlagsBits,
} = require("discord.js");

const discountSchema = require("../../../models/discounts.js");

/**
 * @type {import('../../../typings.js').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.

	data: new SlashCommandBuilder()
		.setName("scrape")
		.setDescription("Scrapes SNKRS stock.")
		.addStringOption((option) =>
			option
				.setName("sku")
				.setDescription("SKU for the SNKRS release.")
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		/**
		 * @type {string}
		 * @description The "command" argument
		 */

		const request_sku = interaction.options.getString("sku");

		const nike_api =
			"https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace%28NL%29&filter=language%28en-GB%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc";

		const headers = {
			authority: "api.nike.com",
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "max-age=0",
			"sec-ch-ua":
				'"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
			"user-agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
		};

		const response = await fetch(nike_api, { headers });
		const json = await response.json();

		const num_of_releases = Object.keys(json.objects).length;
		var fin_release = {};

		for (let i = 0; i < num_of_releases; i++) {
			var release = json.objects[i];

			if (release.productInfo[0].merchProduct.styleColor === request_sku) {
				const release_date = release.productInfo[0].launchView.startEntryDate;
				const release_image =
					release.publishedContent.properties.coverCard.properties.squarish.url;
				const product_name = release.productInfo[0].productContent.fullTitle;
				const release_method = release.productInfo[0].launchView.method;
				const price = release.productInfo[0].merchPrice.currentPrice;
				const skus = release.productInfo[0].skus;
				const gtins = release.productInfo[0].availableGtins;
				var sizes = [];

				for (var sku in skus) {
					sku = skus[sku];
					const gtin = sku.gtin;
					const size = sku.countrySpecifications[0].localizedSize;
					const stock_keeping_unit = sku.stockKeepingUnitId;

					for (var gtin_now in gtins) {
						gtin_now = gtins[gtin_now];
						if (gtin_now.gtin === gtin) {
							const stock_level = gtin_now.level;
							sizes.push({ size, stock_level, stock_keeping_unit });
						}
					}
				}

				fin_release = {
					release_date: release_date,
					release_image: release_image,
					release_method: release_method,
					product_name: product_name,
					price: price,
					sizes: sizes,
				};
				break;
			}
		}

		if (Object.keys(fin_release).length === 0) {
			return interaction.reply({
				content: "Could not find release with SKU `" + request_sku + "`",
				ephemeral: true,
			});
		}

		const ordered_sizes = fin_release.sizes.sort((a, b) => {
			if (a.size < b.size) {
				return -1;
			}
		});

		var sizes_string = "```";
		var stock_level_string = "```";
		var stock_keeping_unit_string = "```";

		for (var size in ordered_sizes) {
			sizes_string += ordered_sizes[size].size + "⠀\n";
			if (ordered_sizes[size].stock_level === "HIGH") {
				stock_level_string +=
					"🟢" + ordered_sizes[size].stock_level + " (> 70 pairs)\n";
			} else if (ordered_sizes[size].stock_level === "MEDIUM") {
				stock_level_string += "🟡" + "MED" + " (40-70 pairs)\n";
			} else if (ordered_sizes[size].stock_level === "LOW") {
				stock_level_string +=
					"🔴" + ordered_sizes[size].stock_level + " (1-40 pairs)\n";
			} else if (ordered_sizes[size].stock_level === "OOS") {
				stock_level_string +=
					"⚫" + ordered_sizes[size].stock_level + " (0 pairs)\n";
			}

			stock_keeping_unit_string += sizes[size].stock_keeping_unit + "⠀\n";
		}

		sizes_string += "```";
		stock_level_string += "```";
		stock_keeping_unit_string += "```";

		const date = new Date(fin_release.release_date);
		var date_string = date.toLocaleString("de-DE", {
			timeZone: "Europe/Berlin",
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});

		const embed = new EmbedBuilder()
			.setTitle(fin_release.product_name)
			.setURL(
				"http://flaneer-api.herokuapp.com/redirect?s=nike&c=DE&sku=" +
					request_sku
			)
			.setThumbnail(fin_release.release_image)
			.addFields(
				{
					name: "Release Date",
					value: "`" + date_string + "`",
					inline: true,
				},
				{
					name: "Release Method",
					value: "`" + fin_release.release_method + "`",
					inline: true,
				},
				{
					name: "Price",
					value: "`" + fin_release.price + "€`",
					inline: true,
				},
				{
					name: "SKU",
					value: "`" + request_sku + "`",
					inline: false,
				},
				{
					name: "Sizes",
					value: sizes_string,
					inline: true,
				},
				{
					name: "Stock Level",
					value: stock_level_string,
					inline: true,
				},
				{
					name: "Regional Links",
					value:
						"[DE](http://flaneer-api.herokuapp.com/redirect?s=nike&c=DE&sku=" +
						request_sku +
						") | [NL](http://flaneer-api.herokuapp.com/redirect?s=nike&c=NL&sku=" +
						request_sku +
						") | [BE](http://flaneer-api.herokuapp.com/redirect?s=nike&c=BE&sku=" +
						request_sku +
						") | [IT](http://flaneer-api.herokuapp.com/redirect?s=nike&c=IT&sku=" +
						request_sku +
						") | [FR](http://flaneer-api.herokuapp.com/redirect?s=nike&c=FR&sku=" +
						request_sku +
						") | [ES](http://flaneer-api.herokuapp.com/redirect?s=nike&c=ES&sku=" +
						request_sku +
						")",
				},
				{
					name: "Resell Links",
					value:
						"[StockX](https://stockx.com/search?s=" +
						request_sku +
						") | [GOAT](https://www.goat.com/search?query=" +
						request_sku +
						") | [KLEKT](https://www.klekt.com/search?query=" +
						request_sku +
						") | [Ebay](https://www.ebay.de/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=" +
						request_sku +
						"&_sacat=0)",
				}
			)
			.setFooter({
				text: "Powered by discord.gg/crazii",
			})
			.setColor(2292922)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });

		return;
	},
};

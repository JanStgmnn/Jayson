const mongo = require("mongoose");

const Schema = new mongo.Schema({
	UserID: String,
	DiscountCode: String,
	DiscountAmount: String,
	DiscountType: String,
});

module.exports = mongo.model("discount", Schema);

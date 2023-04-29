const mongo = require("mongoose");

const Schema = new mongo.Schema({
	UserID: String,
	ChannelID: String,
	Type: String,
	CategoryID: String,
	PaymentType: String,
	Amount: Number,
	Approval: Boolean,
	Status: String,
});

module.exports = mongo.model("tickets", Schema);

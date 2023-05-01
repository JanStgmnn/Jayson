const mongo = require("mongoose");

const Schema = new mongo.Schema({
	UserID: String,
	points: Number,
});

module.exports = mongo.model("player", Schema);

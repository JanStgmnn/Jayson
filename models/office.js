const mongo = require("mongoose");

const Schema = new mongo.Schema({
	OfficeHours: String,
});

module.exports = mongo.model("office", Schema);

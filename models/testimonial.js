const mongo = require("mongoose");

const Schema = new mongo.Schema({
	UserID: Number,
	Stars: String,
});

module.exports = mongo.model("testimonial", Schema);

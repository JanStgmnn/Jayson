const mongo = require("mongoose");

const Schema = new mongo.Schema({
	UserID: Number,
	Answer: String,
	Verified: Boolean,
	Try: Number,
	blocked: Number,
	captcha_msg: Number,
});

module.exports = mongo.model("verification", Schema);

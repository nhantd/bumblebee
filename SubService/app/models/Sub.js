var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubSchema   = new Schema({
	episode_key: String,
	episode_id: Number,
	film_key: String,

	sub_key:String,
	language: {type: String},
	adjust: {type: Number},
	is_available: {type: Boolean},
	manually_replace: {type: Boolean},
	url: {type: String}
});

exports = module.exports = mongoose.model('SubsModel', SubSchema);

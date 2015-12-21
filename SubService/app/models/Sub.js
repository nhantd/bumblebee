var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SubSchema   = new Schema({
	episode_key: String,
	episode_id: Number,
	film_key: String,

	sub_key:String,
	language: {type: String},
	adjust: {type: Types.Number},
	is_available: {type: Types.Boolean},
	manually_replace: {type: Types.Boolean},
	url: {type: String}
});

exports = module.exports = mongoose.model('SubsModel', SubSchema);

var Sub = require('../models/Sub.js');
var util = require('./libs/Common.js');

exports = module.exports = function(req,res){

	var locals = req.locals;

	var sub = req.body;
	var result = {}

	var input = [ 
		sub.episode_id,
		sub.film_key,
		sub.language
	]

	//check input	
	for ( var i = 0; i < input.length; i++ ){
		if ( typeof(input[i])=="undefined" || !input[i] ) {
			result.status = "003";
			result.data = "Missing [episode_id  | film_key | url | language]";
			res.json(result);
			return;
		}
	}
	sub.language=sub.language.toLowerCase()

	Sub.remove({
		{ film_key:sub.film_key,episode_id:sub.episode_id,language:sub.language}  
	}, function (delete_error){
		if (delete_error){
			result.status = "004";
			result.data = "Database connection error";
			res.json(result);
			return;
		} else {
			result.status = "000";
			result.data = "Delete account successfully";
			res.json(result);
			return;
		}
	})
}

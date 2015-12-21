var Episode = require('../models/Episode.js');

exports = module.exports = function(req, res){
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
			result.data = "Missing [episode_id  | film_key  | language]";
			res.json(result);
			return;
		}
	}
	sub.language=sub.language.toLowerCase()

	
	Sub.findOne(
		{ film_key:sub.film_key,episode_id:sub.episode_id,language:sub.language} ,
		function(cexist_err, obj){
			if (cexist_err==null  && !obj) { //if not exit
				result.status = "001";
				result.data = "episode is not exist";
				res.json(result)
			} else if (cexist_err==null){ 
				// console.log("update 1 " + JSON.stringify(obj) )
				// console.log("update 2 " + episode.episode_id)
				Sub.update({ film_key:sub.film_key,episode_id:sub.episode_id,language:sub.language },
				episode,function (err, updateSub) {
					if (err){
						result.status = "004";
						result.data = "Error update";
						res.json(result)
						return;
					}
					result.status = "000";
					result.data = updateSub;
					res.json(result)
				});
			} else {
				result.status = "004";
				result.data = "Cannot access database";
				callback(result)
			}
		}	
	)
}
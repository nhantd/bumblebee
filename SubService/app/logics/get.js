var Sub = require('../models/Sub.js');
var util = require('./libs/Common.js');



var getSubs = function(film_key,episode_id, languages, cb){
	var foundSubs = {};
	var foundLanguages = [];
	async.each(languages,
		function(language, callback){
			Sub.model.findOne({film_key:film_key,episode_id:episode_id,
				language: language, is_available: true}, function(err, sub){
				if ( !err && sub != null){
					foundSubs[language] = sub.url;
					foundLanguages.push(sub.language);
					callback(null);
				} else if (err) {
					callback(err); return;
				} else callback(null);
			})
		},

		function(err){
			var result = (!err && foundLanguages.length > 0);
			cb(result, foundLanguages, foundSubs);
		}
	)
}


exports = module.exports = function(req,res){

	var locals = req.locals;
	var result = {}
	var sub = req.body;

	var input = [ 
			sub.film_key,
			sub.episode_id,
		]

	for ( var i = 0; i < input.length; i++ ){
		if ( typeof(input[i])=="undefined" || !input[i] ) {
			result.status = "003";
			result.data = "Missing [ film_key  |film_key ] or at lease sub_key";
			res.json(result);
			return;
		}
	}

	if (typeof(sub.language) == "undefined"){
		language = 'all'
	}
	else{
		language = sub.language.toLowerCase()
	}
	sub.language = language


	if (typeof(sub.episode_key) == "undefined"){
		sub.episode_key=util.getHashString(sub.film_key+sub.episode_id)
	}

	if (language=-'all'){
		Sub.findOne(
			{ episode_key:sub.episode_key, is_available: true },
			function(cexist_err, obj){
				if (cexist_err==null && !obj) { //if not exit
					result.status = "001";
					result.data = "Cannot find";
					res.json(result);
				} else if (cexist_err==null ){ 
					result.status = "000";
					result.data = obj;
					res.json(result);
				} else {
					result.status = "004";
					result.data = "Cannot check database";
					res.json(result);
				}
			}	
		)	
	}
	else{
		var languages = [];
		languages.push(language);
		getSubs(episode_key, languages, function(rel, foundLanguages, foundSubs) {
			if (!rel){
				result.status='001'
				result.data = "Cannot find";
				res.json(result);
			}	else{
				result.status = "000";
				result.data = rel;
				res.json(result);
			}
		})
	}

	

	


}
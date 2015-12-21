var Sub = require('../models/Sub.js');
var util = require('./libs/Common.js');
var async= require('async')

var getSubs = function(film_key,episode_id, languages, cb){
	var foundSubs = {};
	var foundLanguages = [];
	console.log(typeof(languages))
	if (languages != 'all'){
		//console.log('not all')
		async.each(languages,
			function(language, callback){
				Sub.findOne({film_key:film_key,episode_id:episode_id,
					language: language,is_available: true}, function(err, sub){
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
	else{
		//console.log('all')
		Sub.find({ film_key:film_key, episode_id:episode_id, is_available: true },
		function(cexist_err, obj){
			if (cexist_err==null && !obj) { //if not exit
				result=false;
			} else if (cexist_err==null ){ 
				result=true
				for (var i=0; i<obj.length;i++){
					foundLanguages.push(obj[i].language)
					foundSubs[obj[i].language]=obj[i].url
				}
			}
			cb(result, foundLanguages, foundSubs)
		})

	}
}


exports = module.exports = function(req,res){

	var locals = req.locals;
	var result = {}
	result.data={}

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
	if (typeof(sub.language) == 'string'){
		sub.language=sub.language.toLowerCase()
		sub.language=[sub.language]
	}
	else if (typeof(sub.language) == 'undefined'){
		sub.language='all'	
	}
	else if (typeof(sub.language) == 'object'){
		for (var i=0; i<sub.language.length; i++){
			sub.language[i]=sub.language[i].toLowerCase()
		}
	}

	if (typeof(sub.episode_key) == "undefined"){
		sub.episode_key=sub.film_key+sub.episode_id+sub.language
	}
	
	var languages = sub.language;
	getSubs(sub.film_key,sub.episode_id, languages, function(rel, foundLanguages, foundSubs) {
		if (!rel){
			result.status='001'
			result.data = "Cannot find";
			res.json(result);
		}	else{
			result.status = "000";
			result.data.foundLanguages= foundLanguages;
			result.data.foundSubs= foundSubs;
			res.json(result);
		}
	})
	


}
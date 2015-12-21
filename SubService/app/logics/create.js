var Sub = require('../models/Sub.js');
var util = require('./libs/Common.js');


function checkKey(key,str, callback){
	Sub.findOne(
	{ sub_key:key},
	function(cexist_err, obj){
		if (cexist_err==null && !obj) { //if not exit
			callback(key);
		}
		else if (cexist_err==null && obj) {
			checkKey(util.getHashString(str),str,callback)
		} else {
			callback(null);
		}
	})

}

function createSub(sub, callback){
	var newSub = new Sub();
	checkKey(util.getHashString(sub.film_key+sub.episode_id + sub.language.toLowerCase()), 
		sub.film_key+sub.episode_id + sub.language.toLowerCase(), function(key){
		if (key){
			newSub.episode_key = sub.episode_key
			newSub.sub_key = key;
			newSub.episode_id = sub.episode_id
			newSub.film_key = sub.film_key
			newSub.language = sub.language
			newSub.is_available =sub.is_available
			newSub.manually_replace = sub.manually_replace
			newSub.url = sub.url
			newSub.adjust = sub.adjust

			newSub.save(function(err){
				callback(err);
			})
		} else {
			console.log("Create Sub error ");
			callback()
		}
	})
	
}

exports = module.exports = function(req,res){

	var locals = req.locals;

	var sub = req.body;
	var result = {}

	var input = [ 
		sub.episode_id,
		sub.film_key,
		sub.url,
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

	if (typeof(sub.episode_key) == "undefined"){
		sub.episode_key=sub.film_key+sub.episode_id+sub.language
	}

	Sub.find(
		{ film_key:sub.film_key,episode_id:sub.episode_id,language:sub.language},
		function(cexist_err, obj){
			if (cexist_err==null && obj.length==0) { //if not exit
				createSub(sub, function(create_err){
					if (create_err) {
						result.status = "004";
						result.data = create_err;
						res.json(result);
					} else {
						result.status = "000";
						result.data = "Create sub successfully";
						res.json(result);
					}
				})
			} else if (cexist_err==null && obj){ 
				result.status = "002";
				result.data = "Already has sub in database";
				res.json(result);
			} else {
				result.status = "004";
				result.data = "Cannot check database";
				res.json(result);
			}
		}	
	)
}
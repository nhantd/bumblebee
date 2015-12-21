var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var ip_hash  = "";
var ip = "";
var fs = require('fs');
var uuid = require('node-uuid');

exports = module.exports = {
	isValidUrl: function (url){
		return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
	},

	isValidEmail: function (email){
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
	},

	isSupportVideoLink: function (url){
		if (!this.isValidUrl(url)) return false;
		if ( url.indexOf("https://picasaweb.google.com") !=0 && url.indexOf("https://xmovies8.org") !=0 ) return false;
		return true;
	},

	getUID: function(){
		
		return ip_hash + "-"+ uuid.v1();
	},

	getIP: function(){
		if (!ip){
			var code = execSync('dig +short myip.opendns.com @resolver1.opendns.com');
			if (code){
				ip = code.toString().replace(/\n/g,"");
				shasum.update(ip.replace(/\./g,""));
				ip_hash = shasum.digest('hex');
				console.log("Public IP: " + ip);
				return ip;
			} else {
				process.exit()
			}
		} else {
			return ip;
		}
	},

	parseCookies: function( request) {
	    var list = {},
	        rc = request.headers.cookie;
	    rc && rc.split(';').forEach(function( cookie ) {
	        var parts = cookie.split('=');
	        list[parts.shift().trim()] = decodeURI(parts.join('='));
	    });
	    return list;
	},

	mkdirs: function(dir){
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	},

	getTaskID: function(random_str){
		if (!random_str){
			random_str = uuid.v1().toString()
		}
		console.log(typeof random_str)
		var shasum2 = crypto.createHash('sha1');
		shasum2.update(random_str);
		return shasum2.digest('hex');
	}, 

	getHashString: function(str){
		var shasum2 = crypto.createHash('sha1');
		shasum2.update("mysecretekey!@#456" + str + uuid.v1());
		return shasum2.digest('hex');
	}


}

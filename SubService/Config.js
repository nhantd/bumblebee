exports = module.exports = {

	//START MODIFY

	mode: process.env.MODE,

	ip: null, //set to null to auto get public IP (when deploy on server)

	rest_port: 0,

	service_name: "EpisodeService",
	
	service_path: null,

	redis_config: {
		enable: false,
		host: "127.0.0.1",
		port: "6379"
	},

	mongo_config: {
		enable: true,
		location: 'mongodb://127.0.0.1/sub'
	},

	//for message queue
	rabbit_config : {
		enable: false,
		location: "amqp://localhost"
	},

	logstash : {
		enable: false,
		port: 28777,
		ip: "127.0.0.1",
	},

	

	//remote the item in service_usage if you dont use
	service_usage : {
	},

	//END MODIFY
	setRESTPort : function(port){
		exports.rest_port = port;
	},
	setService: function(name,data){
		exports.service_usage[name] = data;
	},
	setSelfPath: function(path){
		exports.service_path = path;
	},
	getService: function(name){
		if (name in exports.service_usage){
			if (!exports.service_usage[name]) return null;
			else return exports.service_usage[name];
		} else {
			return null;
		}
	},
};


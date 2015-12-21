var zookeeper = require('node-zookeeper-client');
var zk_client = zookeeper.createClient('phim2vl.com:2181');
var Config = require("./Config.js");
var async = require('async');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var util = require('util');
var mode = Config.mode;

var Zookeeper = function(){
	this.isInit = false;
}

Zookeeper.prototype.register = function(){
	
	if (!this.isInit) {
		zk_client.connect();
		this.isInit = true;
	} else {
		console.log("not init")
	}
}

Zookeeper.prototype.watchExist= function(path, callback){
	zk_client.exists(path, callback ,function (error, stat) { 
	});
}


zk_client.once('connected', function () {
	console.log("Connected to Zookeeper")
	var service_name = Config.service_name;
	var service_usage = Config.service_usage;
	var ip = Config.ip;
	var path = "/uniplayer/"+ mode;
	
	zk_client.create(path,new Buffer(""), function (error, path) {
        if (error && error.code!=-110) {
            console.log('Failed to create node: %s due to: %s.', path, error.code);
        	process.exit();
        }
        
        var path = "/uniplayer/"+ mode + "/" +service_name;
        zk_client.create(path,new Buffer(""), function (error) {
	        if (error && error.code!=-110) {
	            console.log('Failed to create node: %s due to: %s. If node is exist ple', path, error);
	        	process.exit();
	        }

    		if (!ip)
		    	ip = require('./app/logics/libs/Common.js').getIP();

		    var data  = "";

		    if (Config.rest_port != 0)
		    	data += ip+":"+Config.rest_port;

		    var path = "/uniplayer/"+ mode+"/"+service_name+"/process_";
		    
		    zk_client.create(path,new Buffer(data.trim()), zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL, function (error, path) {
		        if (error) {
		            console.log('Failed to create node: %s due to: %s. If node is exist ple', path, error);
		            process.exit();
		        } else {
		        	Config.setSelfPath(path);
		        	eventEmitter.emit("zk_created");
		        }

		    });
		});
    });
});



function update_child(path, service, callback, time){
	time++;
	zk_client.getChildren(path, function (){
			null
		},function (error, children, stats) {
	    if (error) {
	        console.log("Service not found " + path);
	        zk_client.getChildren("/uniplayer/"+ mode  , function (error, children, stats) {
			    console.log('Current service usage: %j', children);
			    process.exit();
			});
	    } else {
	    	var service_data = [];
	    	async.each(children,
	    		function(aProc, subcallback){
	    			zk_client.getData(path+"/"+aProc, function (error, data, stats) {
	    				if (!error){
	    					console.log(service + " - " + data.toString('utf8'));
	    				} else {
	    					console.log(error);
	    				}
	    				subcallback();
	    			});
	    		},
	    		function(err){
	    			// Config.setService(service, service_data);
	    			if (time==1)
	    				callback();
	    		}
	    	);

	    }
	});
}


eventEmitter.on("zk_created", function(){
	var service_arr = [];
	var mode = Config.mode;
	zk_client.getChildren("/uniplayer/"+ mode  , function (error, children, stats) {
	    if (!error){
	    	for (var key in children){
				service_arr.push(children[key]);
			}
			async.each(service_arr,
				function(service, callback){
					var path = "/uniplayer/"+ mode + "/" + service;
					update_child(path,service,callback,0);
				},
				function(err){
					console.log("locate at : " + Config.service_path);
					console.log("Use service: " + JSON.stringify(Config.service_usage));
				}
			);

	    } else {
	    	console.log(error);
		    process.exit();
	    }
	});
});



exports = module.exports = new Zookeeper();
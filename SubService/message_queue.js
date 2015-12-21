
var MessageQueue = function(){
	this.PubList = {};
};

MessageQueue.prototype.init = function(){
	var rabbit_config = require("./Config.js").rabbit_config;
	if (rabbit_config.enable){
		this.context = require('rabbit.js').createContext(rabbit_config.location);
		var self =this;
		//test message queue
		self.context.on('ready', function() {
			var random = Math.random()*10000;
			self.createPublisher("PUSH","test_"+random);
			self.createSubscriber("WORKER","test_"+random,function(data, sub){
				console.log("MessageQueue started successfully ... ")
				sub.ack();
			});
			setTimeout(function(){
				self.publishMessage("test_"+random, "Test message queue ...");
			},2000)
		})
	}
	//test message queue
}

MessageQueue.prototype.createPublisher = function(type, name){
	if (!(name in this.PubList)){
		var pub = this.context.socket(type);
		pub.connect(name);
		this.PubList[name] = pub;
	}
}

MessageQueue.prototype.publishMessage = function(name, message){
	if (name in this.PubList){
		var pub = this.PubList[name];
		pub.write(message, 'utf8');
	}
}


MessageQueue.prototype.createSubscriber = function(type, name, callback){
	if (!this.wait_time) {
		var self = this;
		setTimeout(function(){
			var sub = self.context.socket(type);
			sub.connect(name)
			sub.setEncoding('utf8');
			sub.on('data', function(note) { 
				callback(note, sub);
			});
			wait_time=true;
		},5000)
	}
}

exports = module.exports = new MessageQueue();


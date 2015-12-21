exports = module.exports = function (app, router, redis_client){
	// middleware to use for all requests -> check token, authentication ...
	router.use(function(req, res, next) {
	    res.locals = {};
	    res.locals.redis_client = redis_client;
	    res.locals.app = app;
	    next(); 
	});
};

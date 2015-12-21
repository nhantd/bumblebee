

exports = module.exports = function (app, router){

app.use("/", router);
	
var logic = {
		create : './app/logics/create.js',
		list: './app/logics/list.js',
		remove: './app/logics/remove.js',
		update : './app/logics/update.js',
		get: './app/logics/get.js',
	}

router.post('/sub/create', require(logic.create));
router.post('/sub/remove', require(logic.remove));
router.post('/sub/update', require(logic.update));
router.post('/sub/get', require(logic.get));
	
}



exports = module.exports = function (app, router){

	
var logic = {
		create : './app/logics/create.js',
		list: './app/logics/list.js',
		remove: './app/logics/remove.js',
		update : './app/logics/update.js',
		get: './app/logics/get.js',
	}

router.post('/create', require(logic.create));
router.post('/list', require(logic.list));
router.post('/remove', require(logic.remove));
router.post('/update', require(logic.update));
router.post('/get', require(logic.get));
	
}

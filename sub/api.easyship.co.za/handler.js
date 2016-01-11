var Sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var dbconfig = require('./config/dbconfig.js');

module.exports = function(app,done){

	var sequel = new Sequelize(dbconfig.URI,dbconfig.OPTIONS);
	
	var models = {};
	var cfgs = [];
	require('./models').forEach(function(module){
		cm = module.classMethods;
		for (classmethod in cm){
			cm[classmethod] = cm[classmethod].bind(models)
		}

		options = module.options;
		options['classMethods'] = cm;

		models[module.name] = sequel.define(module.name,module.model,options);
		if (module.configure){
			cfgs.push(module.configure);
		}
	});

	cfgs.forEach(function(cfg){
		cfg.call(models);
	});

	
	app.use(function(req,res,next){
		var token = req.query.authtoken;
		if (typeof(token) === "undefined"){
			res.writeHead(403,"Non-existant Auth Token",{'content-type' : 'text/plain'})
			res.end("Invalid Auth Token");
		} else {
			jwt.verify(token,
				'jotiLC9639FNlWKdVhELNQjcBnExOkKdCDkrFUBaXoQRHgiubWHdOZQFBZVxsntFU2Z7YI3cwWjeabhtE8CxmQD6Kperb39mqINjOLNowPyUSJYiW6D8EBhNT5lRqvbd',
				function(err, decoded) {
					if (err){
						if (err instanceof jwt.TokenExpiredError){
							res.writeHead(403,"Request took too long",{'content-type' : 'text/plain'});
							res.end("Request took too long");
						} else {
							res.writeHead(403,"Invalid Auth Token",{'content-type' : 'text/plain'});
							res.end("Invalid Auth Token");
						}
					} else if (decoded.user === "undefined" || typeof(decoded.user) !== "object" || 
						typeof(decoded.user.role) === "undefined" || typeof(decoded.user.email) === "undefined" ||
						typeof(decoded.user.ID) === "undefined" || typeof(decoded.user.username) === "undefined"){
						res.writeHead(403,"Invalid Auth Token Structure",{'content-type' : 'text/plain'});
						res.end("Invalid Auth Token Structure");
					} else {
						req.user = decoded.user;
						next();
					}
				}
			);
		}
	});

	app.use(bodyParser.urlencoded({ extended: false }));

	sequel.sync().then(function(){
		done(null);
	}).catch(done);
}

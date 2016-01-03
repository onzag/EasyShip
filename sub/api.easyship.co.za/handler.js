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
					} else {
						req.user = decoded.user;
						next();
					}
				}
			);
		}
	});

	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(require('./routers/self.js')(models));
	app.use(require('./routers/country.js')(models));
	app.use(require('./routers/city.js')(models));
	//app.use(require('./routers/payment.js'));
	//app.use(require('./routers/location.js'));

	sequel.sync().then(function(){

		/**
		models.Country.buildFrom('South Africa',22.937506,-30.559482).then(function(country){
			console.log(country.toJSON());
			return models.Country.buildFrom('Zimbabwe',29.154857,-19.015438);
		}).then(function(country){
			console.log(country.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/
		

		/**
		models.Duty.buildFrom(1,'XXX','Drugs','Anything seen badly',0.1).then(function(duty){
			console.log(duty.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.City.buildFrom(1,'Johannesburg',28.034088,-26.195246).then(function(city){
			console.log(city.toJSON());
			return models.City.buildFrom(2,'Harare',31.053028,-17.824858);
		}).then(function(city){
			console.log(city.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.CityPriceDistanceInternational.buildFrom(1,0).then(function(relation){
			console.log(relation.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/
		

		/**
		models.PriceWeight.buildFrom(10,0).then(function(pw){
			console.log(pw.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.PriceDistance.buildFrom(0,0).then(function(pw){
			console.log(pw.toJSON());
			return models.PriceDistance.buildFrom(20,6000);
		}).then(function(pw){
			console.log(pw.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/
		

		/**
		models.Surcharge.buildFromDay('Tue Surcharge',2,0.05,'%').then(function(surcharge){
			console.log(surcharge.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.Cargo.buildFrom('Drugs','All Drug related stuff',0,'+').then(function(cargo){
			console.log(cargo.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.Warehouse.buildFrom('Johannesburg Melville',1,28.010201,-26.168660,true,true,true,true,true,true,true,true).then(function(warehouse){
			console.log(warehouse.toJSON());
			return models.Warehouse.buildFrom('Johannesburg Kakana Park',1,27.903728,-26.409283,true,true,true,true,true,true,true,true);
		}).then(function(warehouse){
			console.log(warehouse.toJSON());
			return models.Warehouse.buildFrom('Harare National Sports Stadium',2,30.994921,-17.822998,true,true,true,true,true,true,true,true);
		}).then(function(warehouse){
			console.log(warehouse.toJSON());
			return models.Warehouse.buildFrom('Harare Epworth',2,31.159372,-17.895706,true,true,true,true,true,true,true,true);
		}).then(function(warehouse){
			console.log(warehouse.toJSON());
		}).catch(function(err){
			console.log(err);
		});
		*/

		/**
		models.Shipment.buildFrom('Myself|stuff',null,'cheetah@hotmail.com','04162131231',
			true,false,2,1,'Cleveland Rifle Range','Fountains St',31.142893,-17.838523,27.886530,-26.401530,1,100,20,
				[{'product':'Drugs','code':'XXX','value':1000}]
		).then(function(shipment){
			console.log(shipment.toJSON());
		}).catch(function(err){
			console.log(err.stack);
		});
		*/

		done(null);
		
	}).catch(done);
}

var Sequelize = require('sequelize');
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

	//app.use(require('./routers/self.js')(models));
	//app.use(require('./routers/shipment.js')(models));
	//app.use(require('./routers/payment.js'));
	//app.use(require('./routers/location.js'));

	sequel.sync().then(function(){

		done(null);

		//models.City.buildFrom('Venezuela','Caracas').then(function(city){
		//	console.log(city.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		//models.City.buildFrom('Venezuela','Maracaibo').then(function(city){
		//	console.log(city.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		//models.CityRelation.buildFrom(2,1,600,'+').then(function(relation){
		//	console.log(relation.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		//models.PriceWeight.buildFrom(10,0).then(function(relation){
		//	console.log(relation.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		//models.Surcharge.buildFromDay('Friday Surcharge',5,0.05,'%').then(function(relation){
		//	console.log(relation.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		//models.Shipment.buildFrom('Myself|stuff','cheetah@hotmail.com','04162131231',(new Date()).getTime(),1,2,40,10).then(function(shipment){
		//	console.log(shipment.toJSON());
		//}).catch(function(err){
		//	console.log(err);
		//});

		models.Shipment.findOne().then(function(shipment){
			console.log(shipment.toJSON());
		})
		
	}).catch(done);
}

module.exports(null,function(){})

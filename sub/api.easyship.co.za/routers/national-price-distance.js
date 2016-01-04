var express = require('express');
var citypricedistancenationalerrrors = require('../errors/city_price_distance_national.js'); //I know, let it be
var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/npds',function(req,res){
		models.CityPriceDistanceNational.findAll().then(function(npds){
			res.json(npds.map(function(npd){return npd.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/npd/:id',function(req,res){
		var id = req.params.id;
		models.CityPriceDistanceNational.findOne({
			'where':{'ID':id}
		}).then(function(npd){
			res.json(npd.toJSON());
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/npd',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);
		var distance = parseFloat(req.body.distance);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		} else if (isNaN(distance)){
			return throwError(res,400,"You need to specify the distance to start applying");
		} else if (distance < 0){
			return throwError(res,400,"The distance cannot be negative");
		}

		models.CityPriceDistanceNational.buildFrom(price,distance).then(function(npd){
			res.json(npd.get('ID'));
		}).catch(function(err){
			if (err instanceof citypricedistancenationalerrrors.DistanceAlreadyExistsError){
				return throwError(res,422,"Another distance point already takes place in the exact range");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/npd/:id/price',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		}

		models.CityPriceDistanceNational.update({
			'price':price
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"National Distance Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/npd/:id/distance',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var distance = parseFloat(req.body.price);

		if (isNaN(distance)){
			return throwError(res,400,"You need to specify the distance to start applying");
		} else if (distance < 0){
			return throwError(res,400,"The distance cannot be negative");
		}

		models.CityPriceDistanceNational.update({
			'distance':distance
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"National Distance Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				return throwError(res,422,"Another distance point already takes place in the exact range");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.delete('/api/v1/npd/:id',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var id = req.params.id;
		models.CityPriceDistanceNational.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				return throwError(res,404,"National Distance Price relationship not found");
			}
			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

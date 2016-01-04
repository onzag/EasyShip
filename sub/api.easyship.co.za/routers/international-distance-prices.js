var express = require('express');
var citypricedistanceinternationalerrrors = require('../errors/city_price_distance_international.js'); //I know, let it be

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/ipds',function(req,res){
		models.CityPriceDistanceInternational.findAll().then(function(ipds){
			res.json(ipds.map(function(ipd){return ipd.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/ipd/:id',function(req,res){
		var id = req.params.id;
		models.CityPriceDistanceInternational.findOne({
			'where':{'ID':id}
		}).then(function(ipd){
			res.json(ipd.toJSON());
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/ipd',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);
		var distance = parseFloat(req.body.distance);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		} else if (isNaN(distance)){
			return throwError(res,400,"You need to specify the distance to start applying");
		}

		models.CityPriceDistanceInternational.buildFrom(price,distance).then(function(ipd){
			res.json(ipd.get('ID'));
		}).catch(function(err){
			if (err instanceof citypricedistanceinternationalerrrors.DistanceAlreadyExistsError){
				return throwError(res,422,"Another distance point already takes place in the exact range");
			} else if (err instanceof citypricedistanceinternationalerrrors.NegativeDistanceError){
				return throwError(res,400,"The distance cannot be negative");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/ipd/:id/price',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		}

		models.CityPriceDistanceInternational.update({
			'price':price
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"International Distance Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/ipd/:id/distance',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var distance = parseFloat(req.body.price);

		if (isNaN(distance)){
			return throwError(res,400,"You need to specify the distance to start applying");
		} else if (distance < 0){
			return throwError(res,400,"The distance cannot be negative");
		}

		models.CityPriceDistanceInternational.update({
			'distance':distance
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"International Distance Price relationship not found");
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

	return router;
}

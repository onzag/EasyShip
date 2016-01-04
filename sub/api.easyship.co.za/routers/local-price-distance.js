var express = require('express');
var pricedistanceerrors = require('../errors/price_distance.js'); //I know, let it be
var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/lpds',function(req,res){
		models.PriceDistance.findAll().then(function(lpds){
			res.json(lpds.map(function(lpd){return lpd.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/lpd/:id',function(req,res){
		var id = req.params.id;
		models.PriceDistance.findOne({
			'where':{'ID':id}
		}).then(function(lpd){
			res.json(lpd.toJSON());
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/lpd',function(req,res){

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

		models.PriceDistance.buildFrom(price,distance).then(function(lpd){
			res.json(lpd.get('ID'));
		}).catch(function(err){
			if (err instanceof pricedistanceerrors.DistanceAlreadyExistsError){
				return throwError(res,422,"Another distance point already takes place in the exact range");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/lpd/:id/price',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		}

		models.PriceDistance.update({
			'price':price
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Local Distance Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/lpd/:id/distance',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var distance = parseFloat(req.body.price);

		if (isNaN(distance)){
			return throwError(res,400,"You need to specify the distance to start applying");
		} else if (distance < 0){
			return throwError(res,400,"The distance cannot be negative");
		}

		models.PriceDistance.update({
			'distance':distance
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Local Distance Price relationship not found");
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

	router.delete('/api/v1/lpd/:id',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var id = req.params.id;
		models.PriceDistance.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				return throwError(res,404,"Local Distance Price relationship not found");
			}
			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

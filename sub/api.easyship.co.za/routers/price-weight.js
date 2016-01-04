var express = require('express');
var priceweighterrors = require('../errors/price_weight.js'); //I know, let it be
var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/pws',function(req,res){
		models.PriceWeight.findAll().then(function(pws){
			res.json(pws.map(function(pw){return pw.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/pw/:id',function(req,res){
		var id = req.params.id;
		models.PriceWeight.findOne({
			'where':{'ID':id}
		}).then(function(pw){
			res.json(pw.toJSON());
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/pw',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);
		var weight = parseFloat(req.body.weight);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		} else if (isNaN(weight)){
			return throwError(res,400,"You need to specify the weight to start applying");
		} else if (weight < 0){
			return throwError(res,400,"The weight cannot be negative");
		}

		models.PriceWeight.buildFrom(price,weight).then(function(pw){
			res.json(pw.get('ID'));
		}).catch(function(err){
			if (err instanceof priceweighterrors.WeightAlreadyExistsError){
				return throwError(res,422,"Another weight point already takes place in the exact range");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/pw/:id/price',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var price = parseFloat(req.body.price);

		if (isNaN(price)){
			return throwError(res,400,"You need to specify the price of the unit");
		}

		models.PriceWeight.update({
			'price':price
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Weight Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/pw/:id/weight',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var weight = parseFloat(req.body.weight);

		if (isNaN(weight)){
			return throwError(res,400,"You need to specify the weight to start applying");
		} else if (weight < 0){
			return throwError(res,400,"The weight cannot be negative");
		}

		models.PriceWeight.update({
			'weight':weight
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Weight Price relationship not found");
			}

			res.status(200).send();
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				return throwError(res,422,"Another weight point already takes place in the exact range");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.delete('/api/v1/pw/:id',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var id = req.params.id;
		models.PriceWeight.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				return throwError(res,404,"Weight Price relationship not found");
			}
			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

var express = require('express');
var cargoerrors = require('../errors/cargo.js');
var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/cargos',function(req,res){
		models.Cargo.findAll().then(function(cargos){
			res.json(cargos.map(function(cargo){return cargo.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/cargo',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var name = req.body.name;
		var description = req.body.description;
		var amount = parseFloat(req.body.amount);
		var amount_factor = req.body.factor;

		if (!name){
			return throwError(res,400,"You need to specify a name");
		} else if (!description){
			return throwError(res,400,"You need to specify a description");
		} else if (isNaN(amount)){
			return throwError(res,400,"You need to specify an amount");
		} else if (amount_factor !== '+' && amount_factor !== "%"){
			return throwError(res,400,"You need to specify a factor which must be percentual or addition");
		}

		models.Cargo.buildFrom(name,description,amount,amount_factor).then(function(cargo){
			res.json(cargo.get('ID'));
		}).catch(function(err){
			if (err instanceof cargoerrors.CargoAlreadyExistsError){
				return throwError(res,422,"Cargo Already Exists");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/cargo/:id/name',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var name = req.body.name;

		if (!name){
			return throwError(res,400,"You need to specify a name");
		}
		
		models.Cargo.update({
			'name':name
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Cargo not found");
			}

			res.status(200).send();
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				return throwError(res,422,"Cargo Already Exists");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/cargo/:id/description',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var description = req.body.description;

		if (!description){
			return throwError(res,400,"You need to specify a description");
		}
		
		models.Cargo.update({
			'description':description
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Cargo not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/cargo/:id/amount',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var amount = parseFloat(req.body.amount);

		if (isNaN(amount)){
			return throwError(res,400,"You need to specify an amount");
		}
		
		models.Cargo.update({
			'amount':amount
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Cargo not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/cargo/:id/factor',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var amount_factor = req.body.factor;

		if (amount_factor !== '+' && amount_factor !== "%"){
			return throwError(res,400,"You need to specify a factor which must be percentual or addition");
		}
		
		models.Cargo.update({
			'amount_factor':amount_factor
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Cargo not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

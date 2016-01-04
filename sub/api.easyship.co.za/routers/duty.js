var express = require('express');
var dutyerrors = require('../errors/duty.js');
var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/duties',function(req,res){
		var country = req.query.country;
		var whereClause = {};
		if (country){
			whereClause['country'] = country;
		}

		models.Duty.findAll(whereClause).then(function(duties){
			res.json(duties.map(function(duty){return duty.toJSON()}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/duty/:id',function(req,res){
		var id = req.params.id;
		models.Duty.findAll({
			'where':{'ID':id}
		}).then(function(duty){
			res.json(duty.toJSON());
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/duty',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var country = parseInt(req.body.country);
		var code = req.body.code;
		var name = req.body.name;
		var description = req.body.description;
		var amount = parseFloat(req.body.amount);

		if (isNaN(country)){
			return throwError(res,400,"You need to specify a valid country id");
		} else if (!code){
			return throwError(res,400,"You need to specify a code");
		} else if (!name){
			return throwError(res,400,"You need to specify a name");
		} else if (!description){
			return throwError(res,400,"You need to specify a description");
		} else if (isNaN(amount)){
			return throwError(res,400,"You need to specify a multiplying amount");
		}

		models.Duty.buildFrom(country,code,name,description,amount).then(function(duty){
			res.json(duty.get('ID'));
		}).catch(function(err){
			if (err instanceof dutyerrors.CodeAlreadyExistsError){
				return throwError(res,422,"Code Already Exists");
			} else if (err instanceof dutyerrors.CountryDoesNotExistsError){
				return throwError(res,400,"Country does not Exist");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/duty/:id/name',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var name = req.body.name;

		if (!name){
			return throwError(res,400,"You need to specify a name");
		}
		
		models.Duty.update({
			'name':name
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Duty not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/duty/:id/description',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var description = req.body.description;

		if (!description){
			return throwError(res,400,"You need to specify a description");
		}
		
		models.Duty.update({
			'description':description
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Duty not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/duty/:id/amount',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var amount = parseFloat(req.body.amount);

		if (isNaN(amount)){
			return throwError(res,400,"You need to specify an amount");
		}
		
		models.Duty.update({
			'amount':amount
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Duty not found");
			}

			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.delete('/api/v1/duty/:id',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var id = req.params.id;
		models.Duty.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				return throwError(res,404,"Duty not found");
			}
			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

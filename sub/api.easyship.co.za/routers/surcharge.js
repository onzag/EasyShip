var express = require('express');
var surchargeerrors = require('../errors/surcharge.js');

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();

	router.get('/api/v1/surcharges',function(req,res){
		models.Surcharge.findAll().then(function(surcharges){
			res.json(surcharges.map(function(surcharge){
				return surcharge.toJSON()
			}));
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/surcharge/:id',function(req,res){
		var id = req.params.id;

		models.Surcharge.findOne({
			'where':{
				'ID':id
			}
		}).then(function(surcharge){
			if (surcharge === null){
				return throwError(res,404,"Surcharge not found");
			}

			res.json(surcharge.toJSON());
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/surcharge',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to add a new city");
		}

		var name = req.body.name;
		var amount = parseFloat(req.body.amount);
		var factor = req.body.factor;
		var by = req.body.by;
		if (!by || by !== "range" || by !== "month" || by !== "day"){
			return throwError(res,400,"You need to specify the by attribute with 'range', 'month' or 'day'");
		} else if (!name){
			return throwError(res,400,"You need to specify a name");
		} else if (isNaN(amount)){
			return throwError(res,400,"You need to specify a valid amount");
		} else if (factor !== "+" && factor !== "%"){
			return throwError(res,400,"You need to specify a valid factor being adding or multiplying");
		}

		var promise;
		if (by === "range"){
			var from = parseInt(req.body.from);
			var to = parseInt(req.body.to);

			if (isNaN(from) || from < 0){
				return throwError(res,400,"The from date must be a valid datetime integer");
			} else if (isNaN(to) || to < 0 || to < from){
				return throwError(res,400,"The to date must be a valid datetime integer greater than from");
			}

			promise = models.Surcharge.buildFromRange(name,from,to,amount,factor);
		} else if (by === "month"){
			var month = parseInt(req.body.month);
			if (isNaN(month) || month < 0 || month >= 12){
				return throwError(res,400,"The month must be a number between 0 and 11");
			}

			promise = models.Surcharge.buildFromMonth(name,month,amount,factor);
		} else if (by === "day"){
			var day = parseInt(req.body.day);
			if (isNaN(day) || day < 0 || day >= 7){
				return throwError(res,400,"The day must be a number between 0 and 6");
			}

			promise = models.Surcharge.buildFromDay(name,day,amount,factor);
		}

		promise.then(function(surcharge){
			res.json(surcharge.get('ID'));
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/name',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var name = req.body.name;

		if (!name){
			return throwError(res,400,"You need to specify a name for the surcharge");
		}

		models.Surcharge.update({
			'name':name
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/amount',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var amount = parseFloat(req.body.amount);

		if (isNaN(amount)){
			return throwError(res,400,"You need to specify a valid amount");
		}

		models.Surcharge.update({
			'amount':amount
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/factor',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var factor = req.body.factor;

		if (factor !== "+" && factor !== "%"){
			return throwError(res,400,"You need to specify a valid factor being adding or multiplying");
		}

		models.Surcharge.update({
			'factor':factor
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/range',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var from = parseInt(req.body.from);
		var to = parseInt(req.body.to);

		if (isNaN(from) || from < 0){
			return throwError(res,400,"The from date must be a valid datetime integer");
		} else if (isNaN(to) || to < 0 || to < from){
			return throwError(res,400,"The to date must be a valid datetime integer greater than from");
		}


		models.Surcharge.update({
			'from':from,
			'to':to
		},{
			'where':{
				'ID':id,
				'type':'range'
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge with such range-type not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/month',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var month = parseInt(req.body.month);
		if (isNaN(month) || month < 0 || month >= 12){
			return throwError(res,400,"The month must be a number between 0 and 11");
		}

		models.Surcharge.update({
			'month':month
		},{
			'where':{
				'ID':id,
				'type':'month'
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge with such month-type not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/surcharge/:id/day',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to perform this action");
		}

		var id = req.params.id;
		var day = parseInt(req.body.day);
		if (isNaN(day) || day < 0 || day >= 7){
			return throwError(res,400,"The day must be a number between 0 and 6");
		}

		models.Surcharge.update({
			'day':day
		},{
			'where':{
				'ID':id,
				'type':'day'
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Surcharge with such day-type not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.delete('/api/v1/surcharge/:id',function(req,res){
		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You must be a supervisor to perform this action")
		}

		var id = req.params.id;
		models.Surcharge.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				return throwError(res,404,"Surcharge not found");
			}
			res.status(200).send();
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

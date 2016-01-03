var express = require('express');
var cityerrors = require('./errors/city.js');
var ForeignKeyConstraintError = require('sequelize').ForeignKeyConstraintError;

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.send(error);
}

module.exports = function(models){
	var router = express.Router();

	router.get('/api/v1/cities',function(req,res){
		var country = req.query.country;
		var whereClause = {};
		if (typeof(country) !== "undefined"){
			whereClause = {'country':country}
		}

		models.City.findAll({'where':whereClause}).then(function(cities){
			res.json(cities.map(function(city){
				return city.toJSON()
			}));
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/city/:id',function(req,res){
		var id = req.params.id;

		models.City.findOne({
			'where':{
				'ID':id
			}
		}).then(function(city){
			if (city === null){
				return throwError(res,404,"City not found");
			}

			res.json(city.toJSON());
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/city/:id/location',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to change the location");
		}

		var id = req.params.id;
		var nlong = parseFloat(req.body['long']);
		var nlat = parseFloat(req.body['lat']);

		if (isNaN(nlong) || isNaN(nlat)){
			return throwError(res,400,"You need to specify the latitude and longitude");
		}

		models.City.update({
			'long':nlong,
			'lat':nlat
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"City not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/city/:id/name',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to change the name");
		}

		var id = req.params.id;
		var name = req.body.name;

		if (!name){
			return throwError(res,400,"You need to specify a name for the city");
		}

		models.City.update({
			'name':name
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"City not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/city/:id/country',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to change the country of a city");
		}

		var id = req.params.id;
		var country = parseInt(req.body.country);

		if (isNaN(country)){
			return throwError(res,400,"You need to specify a country");
		}

		models.City.update({
			'country':country
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"City not found");
			}

			res.status(200).send();
		}).catch(function(err){
			if (err instanceof ForeignKeyConstraintError){
				return throwError(res,404,"Country not found");
			} else {
				throwError(res,500,"Internal Error");
			}
		});
	});

	router.put('/api/v1/city',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to add a new city");
		}

		var name = req.body.name;
		var nlong = parseFloat(req.body['long']);
		var nlat = parseFloat(req.body['lat']);
		var country = parseInt(req.body.country)

		if (!name){
			return throwError(res,400,"You need to specify a name for the city");
		} else if (isNaN(nlong) || isNaN(nlat)){
			return throwError(res,400,"You need to specify the latitude and longitude");
		} else if (isNaN(country)){
			return throwError(res,400,"You need to specify a country");
		}

		models.City.buildFrom(country,name,nlong,nlat).then(function(city){
			res.json(city.get('ID'));
		}).catch(function(err){
			if (err instanceof cityerrors.CountryDoesNotExistsError){
				return throwError(res,404,"Country not found");
			} else {
				throwError(res,500,"Internal Error");
			}
		});
	});

	return router;
}

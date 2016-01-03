var express = require('express');

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.send(error);
}

module.exports = function(models){
	var router = express.Router();

	router.get('/api/v1/countries',function(req,res){
		models.Country.findAll().then(function(countries){
			res.json(countries.map(function(country){
				return country.toJSON()
			}));
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/country/:id',function(req,res){
		var id = req.params.id;

		models.Country.findOne({
			'where':{
				'ID':id
			}
		}).then(function(country){
			if (country === null){
				return throwError(res,404,"Country not found");
			}

			res.json(country.toJSON());
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/country/:id/location',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to change the location");
		}

		var id = req.params.id;
		var nlong = parseFloat(req.body['long']);
		var nlat = parseFloat(req.body['lat']);

		if (isNaN(nlong) || isNaN(nlat)){
			return throwError(res,400,"You need to specify the latitude and longitude");
		}

		models.Country.findOne({
			'attributes':['ID'],
			'where':{
				'ID':id
			}
		}).then(function(country){
			if (country === null){
				return throwError(res,404,"Country not found");
			}

			country.updateLocation(nlong,nlat);
			return country.save();
		}).then(function(){
			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/country/:id/name',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to change the name");
		}

		var id = req.params.id;
		var name = req.body.name;

		if (!name){
			return throwError(res,400,"You need to specify a name for the country");
		}

		models.Country.findOne({
			'attributes':['ID'],
			'where':{
				'ID':id
			}
		}).then(function(country){
			if (country === null){
				return throwError(res,404,"Country not found");
			}

			country.updateName(name);
			return country.save();
		}).then(function(){
			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/country',function(req,res){

		if (req.user.role !== 'supervisor'){
			return throwError(res,403,"You need to be supervisor to add a new country");
		}

		var name = req.body.name;
		var nlong = parseFloat(req.body['long']);
		var nlat = parseFloat(req.body['lat']);

		if (!name){
			return throwError(res,400,"You need to specify a name for the country");
		} else if (isNaN(nlong) || isNaN(nlat)){
			return throwError(res,400,"You need to specify the latitude and longitude");
		}

		models.Country.buildFrom(name,nlong,nlat).then(function(country){
			res.json(country.get('ID'));
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	

	return router;
}

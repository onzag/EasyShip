var express = require('express');

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.send(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/self/shipments/sent',function(req,res){

		if (req.user.role !== 'client'){
			return throwError(res,403,"You must be a client to perform this action");
		}

		models.Shipment.findAll({
			'attributes':['ID'],
			'where':{
				'owner':req.user.ID
			}
		}).then(function(shipments){
			res.json(shipments.map(function(shipment){return shipment.get('ID')}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	router.get('/api/v1/self/shipments/incoming',function(req,res){

		if (req.user.role !== 'client'){
			return throwError(res,403,"You must be a client to perform this action")
		}

		models.Shipment.findAll({
			'attributes':['ID'],
			'where':{
				'reciever':req.user.ID
			}
		}).then(function(shipments){
			res.json(shipments.map(function(shipment){return shipment.get('ID')}))
		}).catch(function(err){
			return throwError(res,500,"Internal Error");
		});
	});

	return router;
}

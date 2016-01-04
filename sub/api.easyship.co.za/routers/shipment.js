var express = require('express');
var shipmenterrors = require('./errors/shipment.js')

function throwError(res,code,error){
	res.writeHead(code,error,{'content-type' : 'text/plain'})
	res.end(error);
}

module.exports = function(models){
	var router = express.Router();
	
	router.get('/api/v1/shipment/:id',function(req,res){

		var id = req.params.id;

		models.Shipments.findOne({
			'where':{
				'ID':id
			}
		}).then(function(shipment){
			if (shipment === null){
				return throwError(res,404,"Shipment not found");
			} else if (shipment.owner !== req.user.ID && shipment.reciever !== req.user.ID && req.user.role === 'client'){
				return throwError(res,403,"You cannot access shipments that are not yours");
			}
			res.json(shipment.toJSON());
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/shipment/:id/claim',function(req,res){

		if (req.user.role !== 'client'){
			return throwError(res,403,"Only clients can perform claims");
		}

		var id = req.params.id;
		models.Shipments.update({
			'reciever':req.user.ID
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Shipment not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/shipment',function(req,res){
		if (req.user.role !== 'client'){
			return throwError(res,403,"Only clients can perform shipments");
		}
		var reciever = req.body.reciever || null;

		var email = req.body.email;
		if (!email){
			return throwError(res,400,"You must specify an email");
		}

		var phone = req.body.phone;
		if (!phone){
			return throwError(res,400,"You must specify a phone number");
		}

		var do_pickup = req.body.do_pickup;
		if (typeof(do_pickup) !== "boolean"){
			return throwError(res,400,"You must specify if to pickup the package or not");
		}

		var do_send = req.body.do_send;
		if (typeof(do_send) !== "boolean"){
			return throwError(res,400,"You must specify if to send the package or not");
		}

		var from = parseInt(req.body.from);
		if (isNaN(from)){
			return throwError(res,400,"You must specify the city it's from");
		}

		var to = parseInt(req.body.to);
		if (isNaN(from)){
			return throwError(res,400,"You must specify the city goes to");
		}

		var from_address = req.body.from_address;
		if (!from_address){
			return throwError(res,400,"You must specify the address the package comes from");
		}

		var to_address = req.body.to_address;
		if (!to_address){
			return throwError(res,400,"You must specify the address the package goes to");
		}

		var from_long = parseFloat(req.body.from_long);
		var from_lat = parseFloat(req.body.from_lat);
		if (isNaN(from_long) || isNaN(from_lat)){
			return throwError(res,400,"You must specify the longuitude and latitude of the address the package comes from");
		}

		var to_long = parseFloat(req.body.to_long);
		var to_lat = parseFloat(req.body.to_lat);
		if (isNaN(to_long) || isNaN(to_lat)){
			return throwError(res,400,"You must specify the longuitude and latitude of the address the package goes to");
		}

		var cargo_type = parseInt(req.body.cargo_type);
		if (isNaN(cargo_type)){
			return throwError(res,400,"You must specify the cargo type");
		}

		var cargo_volume = parseFloat(req.body.cargo_volume);
		var cargo_weight = parseFloat(req.body.cargo_weight);
		if (isNaN(cargo_weight) || isNaN(cargo_weight)){
			return throwError(res,400,"You must specify the cargo volume and weight");
		}

		var duties = req.body.duties || null;
		if (duties !== null){
			try {
				duties = JSON.parse(duties);
			} catch(e){
				return throwError(res,400,"The duties object is invalid");
			}

			duties.forEach(function(val){
				if (typeof(val.code) !== "string"){
					return throwError(res,400,"The duties object is invalid");
				} else if (typeof(val.value) !== "number"){
					return throwError(res,400,"The duties object is invalid");
				} else if (typeof(val.product) !== "string"){
					return throwError(res,400,"The duties object is invalid");
				} else if (typeof(val.percent) !== "number"){
					return throwError(res,400,"The duties object is invalid");
				} else if (typeof(val.result) !== "number"){
					return throwError(res,400,"The duties object is invalid");
				} else if (Object.keys(val) !== 5){
					return throwError(res,400,"The duties object is invalid");
				}
			});
		}

		models.Shipments.buildFrom(req.user.ID,reciever,
			email,phone,
			do_pickup,do_send,
			from,to,
			from_address,to_address,
			from_long,from_lat,to_long,to_lat,
			cargo_type,
			cargo_volume,cargo_weight,
			duties
		).then(function(shipment){
			res.json(shipment.toJSON());
		}).catch(function(err){

			if (err instanceof shipmenterrors.CityFromError){
				return throwError(res,400,"The city that the shipment comes from does not exist");
			} else if (err instanceof shipmenterrors.CityToError){
				return throwError(res,400,"The city that the shipment goes to does not exist");
			} else if (err instanceof shipmenterrors.NoDutiesError){
				return throwError(res,400,"Please provide duties to associate with this shipment");
			} else if (err instanceof shipmenterrors.DutiesSpecifiedError){
				return throwError(res,400,"You're providing duties in a non-international trip");
			} else if (err instanceof shipmenterrors.NoDutyCodeError){
				return throwError(res,400,"There's an provide the duty code for an item");
			} else if (err instanceof shipmenterrors.NoDutyValueError){
				return throwError(res,400,"You didn't provide a valid duty code for an item");
			} else if (err instanceof shipmenterrors.NoDutyProductNameError){
				return throwError(res,400,"You didn't specify the product of a duty");
			} else if (err instanceof shipmenterrors.InvalidDutyCodeError){
				return throwError(res,400,"One or more duty codes are invalid");
			} else if (err instanceof shipmenterrors.NoWarehousesFromError){
				return throwError(res,400,"There are no warehouses in the city the package comes from");
			} else if (err instanceof shipmenterrors.NoWarehousesToError){
				return throwError(res,400,"There are no warehouses in the city the package goes to");
			} else if (err instanceof shipmenterrors.RelationError){
				return throwError(res,400,"We're sorry, right now we cannot to that location");
			} else if (err instanceof shipmenterrors.RelationDisabledError){
				return throwError(res,400,"We're sorry, right now the dispach to such location is not allowed");
			} else if (err instanceof shipmenterrors.NoPriceDataError){
				return throwError(res,400,"Sorry, There's no price information");
			} else if (err instanceof shipmenterrors.NoPriceDataPickSendError){
				return throwError(res,400,"Sorry, There's no price information for pickup or send");
			} else {
				return throwError(res,500,"Internal Error");
			}
		});
	});

	router.post('/api/v1/shipment/:id/changewarehouse',function(req,res){

		if (req.user.role === 'client'){
			throwError(res,403,"You cannot access this if you're not staff");
		}

		var id = req.params.id;
		var warehouse = (req.body.warehouse || null);

		models.Shipments.findOne({
			'attributes':['ID'],
			'where':{
				'ID':id
			}
		}).then(function(shipment){
			if (shipment === null){
				return throwError(res,404,"Shipment not found");
			}

			if (warehouse !== null){
				models.Warehouses.findOne({
					'attributes':['ID'],
					'where':{'ID':warehouse}
				}).then(function(warehouse){
					if (warehouse === null){
						return throwError(res,404,"Warehouse not found");
					}
					shipment.changeWarehouse(warehouse,req.user.ID);
					return shipment.save();
				}).then(function(){
					res.status(200).send();
				}).catch(function(err){
					throwError(res,500,"Internal Error");
				});
			} else {
				shipment.changeWarehouse(warehouse,req.user.ID);
				shipment.save().then(function(){
					res.status(200).send();
				}).catch(function(err){
					throwError(res,500,"Internal Error");
				});
			}
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.put('/api/v1/shipment/:id/message',function(req,res){

		if (req.user.role === 'client'){
			throwError(res,403,"You cannot access this if you're not staff");
		}

		var id = req.params.id;
		var message = req.body.message;
		var warehouse = req.body.warehouse;

		models.Warehouse.findOne({
			'attributes':['ID'],
			'where':{
				'ID':warehouse
			}
		}).then(function(warehouse){

			if (warehouse === null){
				return throwError(res,404,"Warehouse not found");
			}

		 	return models.Shipments.findOne({
				'attributes':['ID'],
				'where':{
				'ID':id
			});

		}).then(function(shipment){
			if (shipment === null){
				return throwError(res,404,"Shipment not found");
			}

			shipment.putStaffMessage(req.user.ID,message,warehouse);
			return shipment.save();
		}).then(function(){
			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/shipment/:id/deliver',function(req,res){
		if (req.user.role === 'client'){
			throwError(res,403,"You cannot access this if you're not staff");
		}

		var id = req.params.id;
		models.Shipments.update({
			'delivered':true,
			'delivered_by':req.user.ID
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Shipment not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/shipment/:id/undeliver',function(req,res){
		if (req.user.role !== 'supervisor'){
			throwError(res,403,"You cannot access this if you're not a supervisor");
		}

		var id = req.params.id;
		models.Shipments.update({
			'delivered':false,
			'delivered_by':null
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Shipment not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/shipment/:id/block',function(req,res){
		if (req.user.role === 'client'){
			throwError(res,403,"You cannot access this if you're not staff");
		}

		var id = req.params.id;
		models.Shipments.update({
			'blocked':true,
			'blocked_by':req.user.ID
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Shipment not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	router.post('/api/v1/shipment/:id/unblock',function(req,res){
		if (req.user.role === 'client'){
			throwError(res,403,"You cannot access this if you're not staff");
		}

		var id = req.params.id;
		models.Shipments.update({
			'blocked':false,
			'blocked_by':null
		},{
			'where':{
				'ID':id
			}
		}).spread(function(ac,ar){
			if (ac === 0){
				return throwError(res,404,"Shipment not found");
			}

			res.status(200).send();
		}).catch(function(err){
			throwError(res,500,"Internal Error");
		});
	});

	return router;
}

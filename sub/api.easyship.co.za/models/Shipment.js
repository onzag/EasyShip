var Sequelize = require('sequelize');
var Promise = require('bluebird');

var ValidationError = Sequelize.ValidationError;
var errors = require('../errors/shipment.js');

function promiseObject(obj){

	var attrs = Object.keys(obj);
	attrs.map(function(attr){
		return obj[attr];
	});

	return Promise.all(vals).then(function(resolved_vals){
		var nobj = {};
		attrs.forEach(function(attr,index){
			nobj[attr] = resolved_vals[index];
		});
		return nobj;
	});
}

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	owner:{
		type:Sequelize.TEXT
	},
	email:{
		type:Sequelize.TEXT
	},
	phone:{
		type:Sequelize.TEXT
	},
	do_pickup:{
		type:Sequelize.BOOLEAN
	},
	do_send:{
		type:Sequelize.BOOLEAN
	},

	from:{
		type:Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cities',
			key:'ID'
		},
		onDelete:'restrict'
	},
	from_address:{
		type:Sequelize.TEXT
	},
	to:{
		type:Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cities',
			key:'ID'
		},
		onDelete:'restrict'
	},
	to_address:{
		type:Sequelize.TEXT
	},
	
	location_current:{
		type:Sequelize.INTEGER.UNSIGNED,
		allowNull:true,
		defaultValue:null
	},
	location_current_time:{
		type:Sequelize.INTEGER.UNSIGNED,
		allowNull:true,
		defaultValue:null
	},

	location_history:{
		type: Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('location_history');
			var data;
			if (value){
				try {
					data = JSON.parse(value);
				} catch (e){
				}
			}
			return data;
		},
		set:function(value){

			value.forEach(function(val){
				if (typeof(val.time) !== "number"){
					throw new ValidationError('Invalid time property',[])
				} else if (typeof(val.location) !== "number"){
					throw new ValidationError('Invalid location property',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('location_history',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},

	update_data:{
		type: Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('update_data');
			var data;
			if (value){
				try {
					data = JSON.parse(value);
				} catch (e){
				}
			}
			return data;
		},
		set:function(value){

			value.forEach(function(val){
				if (typeof(val.time) !== "number"){
					throw new ValidationError('Invalid time property',[])
				} else if (typeof(val.location) !== "number"){
					throw new ValidationError('Invalid location property',[])
				} else if (typeof(val.staff) !== "string"){
					throw new ValidationError('Invalid staff property',[])
				} else if (typeof(val.message) !== "string"){
					throw new ValidationError('Invalid message property',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('update_data',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},

	cargo_type:{
		type:Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cargos',
			key:'ID'
		},
		onDelete:'restrict'
	},
	cargo_volume:{
		type:Sequelize.DECIMAL
	},
	cargo_weight:{
		type:Sequelize.DECIMAL
	},
	chargeable_weight:{
		type:Sequelize.DECIMAL
	},
	kgprice:{
		type:Sequelize.DECIMAL
	},
	grossprice:{
		type:Sequelize.DECIMAL
	},
	trip_amount:{
		type:Sequelize.DECIMAL
	},
	trip_amount_factor:{
		type:Sequelize.ENUM('+','%')
	},
	baseprice:{
		type:Sequelize.DECIMAL
	},
	surcharge:{
		type:Sequelize.DECIMAL
	},
	surcharge_details:{
		type:Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('surcharge_details');
			var data;
			if (value){
				try {
					data = JSON.parse(value);
				} catch (e){
				}
			}
			return data;
		},
		set:function(value){

			value.forEach(function(val){
				console.log(val);
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid surcharge name',[])
				} else if (typeof(val.factor) !== "string" || (val.factor !== "%" && val.factor !== "+")){
					throw new ValidationError('Invalid surcharge factor',[])
				} else if (typeof(val.amount) !== "number"){
					throw new ValidationError('Invalid surcharge amount',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('surcharge_details',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},
	totalprice:{
		type:Sequelize.DECIMAL
	},
	cargo_type_amount:{
		type:Sequelize.DECIMAL
	},
	cargo_type_factor:{
		type:Sequelize.ENUM('+','%')
	}
	do_pickup_amount:{
		type:Sequelize.DECIMAL,
		allowNull:true
	},
	do_pickup_amount_factor:{
		type:Sequelize.ENUM('+','%'),
		allowNull:true
	},
	do_send_amount:{
		type:Sequelize.DECIMAL,
		allowNull:true
	},
	do_send_amount_factor:{
		type:Sequelize.ENUM('+','%'),
		allowNull:true
	},
	finalprice:{
		type:Sequelize.DECIMAL
	},

	documents_internal:{
		type:Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('documents');
			var data;
			if (value){
				try {
					data = JSON.parse(value);
				} catch (e){
				}
			}
			return data;
		},
		set:function(value){

			value.forEach(function(val){
				console.log(val);
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid file name',[])
				} else if (typeof(val.description) !== "string"){
					throw new ValidationError('Invalid file description',[])
				} else if (typeof(val.url) !== "string" && val.url !== null){
					throw new ValidationError('Invalid file url',[])
				} else if (typeof(val.uploader) !== "string"){
					throw new ValidationError('Invalid uploader',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('documents',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},

	documents:{
		type:Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('documents');
			var data;
			if (value){
				try {
					data = JSON.parse(value);
				} catch (e){
				}
			}
			return data;
		},
		set:function(value){

			value.forEach(function(val){
				console.log(val);
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid file name',[])
				} else if (typeof(val.url) !== "string"){
					throw new ValidationError('Invalid file url',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('documents',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},

	blocked:{
		type:Sequelize.BOOLEAN,
		defaultValue:false
	},
	paid:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null
	},
	delivered:{
		type:Sequelize.INTEGER,
		allowNull:true,
		defaultValue:null
	}
}

var classMethods = {
	buildFrom: function(
		owner,
		email,phone,
		do_pickup,do_send,
		from,to,
		from_address,to_address
		cargo_type,
		cargo_volume,cargo_weight){		

		var _this = this;
		var data = {
			'fields':{'owner':owner,
				'email':email,
				'phone':phone,
				'do_pickup':do_pickup,
				'do_send':do_send,
				'from':from,
				'to':to,
				'from_address':from_address,
				'to_address':to_address,
				'cargo_type':cargo_type,
				'cargo_volume':cargo_volume,
				'cargo_weight':cargo_weight
			}
		};

		data.cityfrom = _this.City.findOne({
			attributes:['ID','allow_picksend','picksend_amount','picksend_factor'],
			where:{'ID':from}
		});

		return promiseObject(data).then(function(data){

			if (data.cityfrom === null){
				throw new errors.CityFromError();
			} else if (!data.cityfrom.get('allow_picksend') && do_pickup){
				throw new errors.CityPickupError();
			}

			data.cityto = _this.City.findOne({
				attributes:['ID','allow_picksend','picksend_amount','picksend_factor'],
				where:{'ID':to}
			});

			return promiseObject(data);

		}).then(function(data){

			if (data.cityto === null){
				throw new errors.CityToError();
			} else if (!data.cityto.get('allow_picksend') && do_send){
				throw new errors.CitySendError();
			}

			data.relation = _this.CityRelation.findOne({
				attributes:['amount','amount_factor','disabled'],
				where:{'from':from,'to':to}
			});
			return promiseObject(data);

		}).then(function(data){

			if (data.relation === null){
				throw new errors.RelationError()
			} else if (data.relation.get('disabled')){
				throw new errors.RelationDisabledError()
			}

			data.cargo = _this.Cargo.findAll({
				'fields':['amount','amount_factor']
				'where':{
					'ID':cargo_type
				}
			});

		}).then(function(data){

			if (data.cargo === null){
				throw new InvalidCargoError();
			}

			data.fields.chargeable_weight = data.fields.cargo_weight;
			var volume_weight = data.fields.cargo_volume / data.fields.cargo_weight;
			if (volume_weight > data.fields.cargo_weight){
				data.fields.chargeable_weight = volume_weight;
			}

			data.fields.trip_amount = data.relation.get('amount');
			data.fields.trip_amount_factor = data.relation.get('amount_factor');

			data.price = _this.PriceWeight.findOne({
				'attributes':['price'],
				'where':{
					weight:{
						$lte:chargeable_weight
					}
				},
				'order': 'weight ASC'
			});

			return promiseObject(data);

		}).then(function(data){

			if (data.price === null){
				throw new errors.NoPriceDataError();
			}

			data.fields.kgprice = data.price.price;
			data.fields.grossprice = data.fields.kgprice*data.fields.chargeable_weight;

			if (data.fields.trip_amount_factor === '%'){
				data.fields.baseprice = data.grossprice*(1 + data.fields.trip_amount);
			} else {
				data.fields.baseprice = data.grossprice + data.fields.trip_amount;
			}

			data.surcharge = _this.Surcharge.findAll();

			return promiseObject(data);

		}).then(function(data){

			var now = new Date()
			var nowtime = now.getTime();
			var day = now.getDay();
			var month = now.getMonth();

			data.fields.totalprice = data.baseprice;
			data.fields.surcharge_details = [];
			data.surcharge.forEach(function(rule){
				var amount = 0;
				var amount_factor = '+';
				var name = null;
				if (
					(rule.get('type') === "range" && nowtime >= rule.get('from') && nowtime < rule.get('to')) ||
					(rule.get('type') === "day" && day === rule.get('on')) ||
					(rule.get('type') === "month" && month === rule.get('on'))
						
				){
					amount = rule.get('amount');
					amount_factor = rule.get('amount_factor');
					name = rule.get('name');
				}
						
				if (amount_factor === '%'){
					data.fields.totalprice*=1+amount;
				} else {
					data.fields.totalprice+=amount;
				}

				if (name !== null){
					data.fields.surcharge_details.push({
						'name':name,
						'amount':amount,
						'factor':amount_factor
					});
				}
			});

			data.fields.surcharge = totalprice-baseprice;
			data.cargo = _this.Cargo.findAll({
				'fields':['amount','amount_factor']
				'where':{
					'ID':data.fields.cargo_type
				}
			});
			return promiseObject(data);

		}).then(function(data){

			if (data.cargo === null){
				throw new InvalidCargoError();
			}

			data.fields.finalprice = data.fields.totalprice;

			data.fields.cargo_type_amount = data.cargo.get('amount');
			data.fields.cargo_type_factor = data.cargo.get('amount_factor');

			if (data.fields.cargo_type_factor === '%'){
				data.fields.finalprice *= 1 + data.fields.cargo_type_amount;
			} else {
				data.fields.finalprice += data.fields.cargo_type_amount;
			}

			if (data.fields.do_pickup){
				data.fields.do_pickup_amount = data.cityfrom.get('picksend_amount');
				data.fields.do_pickup_factor = data.cityfrom.get('picksend_factor');
				if (data.fields.do_pickup_factor  === '%'){
					data.fields.finalprice *= 1 + data.fields.do_pickup_amount;
				} else {
					data.fields.finalprice += data.fields.do_pickup_amount;
				}
			} else {
				data.fields.do_pickup_amount = null;
				data.fields.do_pickup_factor = null;
			}

			if (data.fields.do_send){
				data.fields.do_send_amount = data.cityto.get('picksend_amount');
				data.fields.do_send_factor = data.cityto.get('picksend_factor');
				if (data.fields.do_send_factor  === '%'){
					data.fields.finalprice *= 1 + data.fields.do_send_amount;
				} else {
					data.fields.finalprice += data.fields.do_send_amount;
				}
			} else {
				data.fields.do_pickup_amount = null;
				data.fields.do_pickup_factor = null;
			}

			return _this.Shipment.create(data.fields);

		})

	}
}

var instanceMethods = {
	changeLocation:function(newloc) {
		var curloc = this.getDataValue('location_current');
		var curtime = this.getDataValue('location_current_time');
		this.setDataValue('location_current',newloc);
		this.setDataValue('location_current_time',(new Date()).getTime());
		if (curloc !== null){
			var history = this.get('location_history');
			history.push({
				'time':curtime,
				'location':curloc
			});
			this.set('location_history',history);
		}
	},
	putStaffMessage:function(staff,message,location){
		var updates = this.get('update_data');
		updates.push({
			'time':(new Date()).getTime(),
			'location':location,
			'message':message,
			'staff':staff
		});
		this.set('update_data',updates);
	},
	setDelivered:function(){
		this.setDataValue('delivered',(new Date()).getTime())
	},
	setPaid:function(){
		this.setDataValue('paid',(new Date()).getTime())
	}
}

module.exports = {
	'name':'Shipment',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

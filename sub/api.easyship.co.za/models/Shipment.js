var Sequelize = require('sequelize');
var Promise = require('bluebird');
var geolib = require('geolib');

var ValidationError = Sequelize.ValidationError;
var errors = require('../errors/shipment.js');

function promiseObject(obj){
	var attrs = Object.keys(obj);
	var vals = attrs.map(function(attr){
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
	reciever:{
		type:Sequelize.TEXT,
		allowNull:true
	},
	code:{
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4
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
	from_lat:{
		type:Sequelize.DECIMAL
	},
	from_long:{
		type:Sequelize.DECIMAL
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
	to_lat:{
		type:Sequelize.DECIMAL
	},
	lo_long:{
		type:Sequelize.DECIMAL
	},

	duties:{
		type: Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('duties');
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
				if (typeof(val.code) !== "string"){
					throw new ValidationError('Invalid code property',[])
				} else if (typeof(val.value) !== "number"){
					throw new ValidationError('Invalid value property',[])
				} else if (typeof(val.product) !== "string"){
					throw new ValidationError('Invalid product property',[])
				} else if (typeof(val.percent) !== "number"){
					throw new ValidationError('Invalid percent property',[])
				} else if (typeof(val.result) !== "number"){
					throw new ValidationError('Invalid result property',[])
				} else if (Object.keys(val).length !== 5){
					throw new ValidationError('Invalid object size',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('duties',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		}
	},

	warehouse_from_closest:{
		type:Sequelize.INTEGER.UNSIGNED,
	},
	warehouse_from_closest_distance:{
		type:Sequelize.DECIMAL,
	},
	warehouse_to_closest:{
		type:Sequelize.INTEGER.UNSIGNED
	},
	warehouse_to_closest_distance:{
		type:Sequelize.DECIMAL
	},
	
	warehouse_current:{
		type:Sequelize.INTEGER.UNSIGNED,
		allowNull:true,
		defaultValue:null
	},
	warehouse_current_time:{
		type:Sequelize.INTEGER.UNSIGNED,
		allowNull:true,
		defaultValue:null
	},
	warehouse_current_staff:{
		type:Sequelize.TEXT
	},

	warehouse_history:{
		type: Sequelize.TEXT,
		defaultValue:"[]",
		get:function(){
			var value = this.getDataValue('warehouse_history');
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
				} else if (typeof(val.location) !== "number" && val.location !== null){
					throw new ValidationError('Invalid location property',[])
				} else if (typeof(val.staff) !== "string"){
					throw new ValidationError('Invalid staff property',[])
				} else if (Object.keys(val).length !== 3){
					throw new ValidationError('Invalid object size',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('warehouse_history',value);
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
				} else if (typeof(val.warehouse) !== "number"){
					throw new ValidationError('Invalid warehouse property',[])
				} else if (typeof(val.staff) !== "string"){
					throw new ValidationError('Invalid staff property',[])
				} else if (typeof(val.message) !== "string"){
					throw new ValidationError('Invalid message property',[])
				}  else if (Object.keys(val).length !== 4){
					throw new ValidationError('Invalid object size',[])
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

	///FIX CARGO_TYPE TO BE AN ARRAY PER BOX
	cargo_type:{
		type:Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cargos',
			key:'ID'
		},
		onDelete:'restrict'
	},

	//FIX CARGO_VOLUME TO BE AN ARRAY PER BOX AND ADD TOTAL_VOLUME
	cargo_volume:{
		type:Sequelize.DECIMAL
	},

	//FIX CARGO_VOLUME TO BE AN ARRAY PER BOX AND ADD TOTAL_WEIGHT
	cargo_weight:{
		type:Sequelize.DECIMAL
	},

	//FIX THIS TO BE AN ARRAY PER BOX AND ADD TOTAL_CHARGEABLE_WEIGHT
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
			if (value === null){
				return null;
			}

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

			if (value === null){
				return this.setDataValue('surcharge_details',null);
			}

			value.forEach(function(val){
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid surcharge name',[])
				} else if (typeof(val.factor) !== "string" || (val.factor !== "%" && val.factor !== "+")){
					throw new ValidationError('Invalid surcharge factor',[])
				} else if (typeof(val.amount) !== "number"){
					throw new ValidationError('Invalid surcharge amount',[])
				} else if (Object.keys(val).length !== 3){
					throw new ValidationError('Invalid object size',[])
				}
			});

			try {
				value = JSON.stringify(value);
				this.setDataValue('surcharge_details',value);
			} catch(e){
				throw new ValidationError('Invalid JSON Object',[e]);
			}
		},
		allowNull:true,
	},
	totalprice:{
		type:Sequelize.DECIMAL
	},
	cargo_type_amount:{
		type:Sequelize.DECIMAL
	},
	cargo_type_factor:{
		type:Sequelize.ENUM('+','%')
	},
	do_pickup_amount:{
		type:Sequelize.DECIMAL,
		allowNull:true
	},
	do_send_amount:{
		type:Sequelize.DECIMAL,
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
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid file name',[])
				} else if (typeof(val.description) !== "string"){
					throw new ValidationError('Invalid file description',[])
				} else if (typeof(val.url) !== "string" && val.url !== null){
					throw new ValidationError('Invalid file url',[])
				} else if (typeof(val.uploader) !== "string"){
					throw new ValidationError('Invalid uploader',[])
				} else if (Object.keys(val).length !== 4){
					throw new ValidationError('Invalid object size',[])
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
				if (typeof(val.name) !== "string"){
					throw new ValidationError('Invalid file name',[])
				} else if (typeof(val.url) !== "string"){
					throw new ValidationError('Invalid file url',[])
				} else if (Object.keys(val).length !== 2){
					throw new ValidationError('Invalid object size',[])
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
	blocked_by:{
		type:Sequelize.TEXT,
		allowNull:true,
		defaultValue:null
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
	},
	delivered_by:{
		type:Sequelize.TEXT,
		allowNull:true,
		defaultValue:null
	}
}

var classMethods = {
	buildFrom: function(
		owner,reciever,
		email,phone,
		do_pickup,do_send,
		from,to,
		from_address,to_address,
		from_long,from_lat,to_long,to_lat,
		cargo_type,
		cargo_volume,cargo_weight,
		duties){

		var _this = this;
		var data = {
			'fields':{
				'owner':owner,
				'reciever':reciever,
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
				'cargo_weight':cargo_weight,
				'from_lat':from_lat,
				'from_long':from_long,
				'to_lat':to_lat,
				'to_long':to_long,
				'duties':duties
			}
		};

		data.cityfrom = _this.City.findOne({
			attributes:['ID','country','long','lat'],
			where:{'ID':from}
		});

		return promiseObject(data).then(function(data){

			if (data.cityfrom === null){
				throw new errors.CityFromError();
			}

			data.cityto = _this.City.findOne({
				attributes:['ID','country','long','lat'],
				where:{'ID':to}
			});

			return promiseObject(data);

		}).then(function(data){

			if (data.cityto === null){
				throw new errors.CityToError();
			}

			if (data.cityto.get('country') !== data.cityfrom.get('country') && (data.fields.duties === null || 
				!(data.fields.duties instanceof Array) || data.fields.duties.length === 0)){
				throw new errors.NoDutiesError();
			} else if (data.cityto.get('country') === data.cityfrom.get('country') && (data.fields.duties !== null)){
				throw new errors.DutiesSpecifiedError();
			}

			data.international = (data.cityto.get('country') !== data.cityfrom.get('country'));

			var whereClauseFrom = {'city':data.cityfrom.get('ID')};
			var whereClauseTo = {'city':data.cityto.get('ID')};
			if (data.fields.do_pickup){
				whereClauseFrom.allow_pickup = true;
			} else {
				whereClauseFrom.allow_personal_put = true;
			}
			if (data.fields.do_send){
				whereClauseTo.allow_send = true;
			} else {
				whereClauseFrom.allow_personal_get = true;
			}
			if (data.international){
				whereClauseFrom.allow_international_put = true;
				whereClauseTo.allow_international_get = true;
			} else {
				whereClauseFrom.allow_national_put = true;
				whereClauseTo.allow_national_get = true;
			}

			data.warehouses_from = _this.Warehouse.findAll({
				'fields':['ID','long','lat'],
				'where':whereClauseFrom
			});

			data.warehouses_to = _this.Warehouse.findAll({
				'fields':['ID','long','lat'],
				'where':{
					'city':data.cityto.ID
				}
			});

			data.cargo = _this.Cargo.findAll({
				'fields':['amount','amount_factor'],
				'where':{
					'ID':cargo_type
				}
			});

			return promiseObject(data);

		}).then(function(data){

			if (data.cargo === null){
				throw new errors.InvalidCargoError();
			} else if (data.warehouses_from.length === 0){
				throw new errors.NoWarehousesFromError();
			} else if (data.warehouses_to.length === 0){
				throw new errors.NoWarehousesToError();
			}

			var wf = {};
			data.warehouses_from.forEach(function(warehouse){
				wf[warehouse.get('ID')] = {latitude: warehouse.get('lat'), longitude: warehouse.get('long')}
			});

			var wfr = geolib.findNearest({
				longitude:data.fields.from_long,
				latitude:data.fields.from_lat
			}, wf, 0);

			data.fields.warehouse_from_closest = parseInt(wfr.key);
			data.fields.warehouse_from_closest_distance = wfr.distance;

			var wt = {};
			data.warehouses_to.forEach(function(warehouse){
				wt[warehouse.get('ID')] = {latitude: warehouse.get('lat'), longitude: warehouse.get('long')}
			});

			var wtr = geolib.findNearest({
				longitude:data.fields.to_long,
				latitude:data.fields.to_lat
			}, wt, 0);

			data.fields.warehouse_to_closest = parseInt(wtr.key);
			data.fields.warehouse_to_closest_distance = wtr.distance;

			data.distancebetweencities = geolib.getDistance({
				'longitude':data.cityfrom.get('long'),
				'latitude':data.cityfrom.get('lat')
			},{
				'longitude':data.cityto.get('long'),
				'latitude':data.cityto.get('lat')
			});

			var model = 'CityPriceDistanceNational';
			if (data.international){
				model = 'CityPriceDistanceInternational'
			}

			data.trip_price = _this[model].findOne({
				'attributes':['price'],
				'where':{
					'distance':{
						$lte:data.distancebetweencities
					}
				},
				'order': 'distance DESC'
			});
			return promiseObject(data);

		}).then(function(data){

			if (data.trip_price === null){
				throw new errors.NoPriceDistanceDataError();
			}

			data.fields.chargeable_weight = data.fields.cargo_weight;
			var volume_weight = data.fields.cargo_volume / data.fields.cargo_weight;
			if (volume_weight > data.fields.cargo_weight){
				data.fields.chargeable_weight = volume_weight;
			}

			data.fields.trip_amount = data.distancebetweencities*data.trip_price.get('price');

			data.weight_price = _this.PriceWeight.findOne({
				'attributes':['price'],
				'where':{
					weight:{
						$lte:data.fields.chargeable_weight
					}
				},
				'order': 'weight DESC'
			});

			return promiseObject(data);

		}).then(function(data){

			if (data.weight_price === null){
				throw new errors.NoPriceWeightDataError();
			}

			data.fields.kgprice = data.weight_price.get('price');
			data.fields.grossprice = data.fields.kgprice*data.fields.chargeable_weight;

			data.fields.baseprice = data.fields.grossprice + data.fields.trip_amount;

			data.surcharge = _this.Surcharge.findAll();

			return promiseObject(data);

		}).then(function(data){

			var now = new Date()
			var nowtime = now.getTime();
			var day = now.getDay();
			var month = now.getMonth();

			data.fields.totalprice = data.fields.baseprice;
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

			data.fields.surcharge = data.fields.totalprice-data.fields.baseprice;
			data.cargo = _this.Cargo.findOne({
				'fields':['amount','amount_factor'],
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
				data.distance_from_price = _this.PriceDistance.findOne({
					'attributes':['price'],
					'where':{
						'distance':{
							$lte:data.fields.warehouse_from_closest_distance
						}
					},
					'order': 'distance DESC'
				});

			}
			if (data.fields.do_send){
				data.distance_to_price = _this.PriceDistance.findOne({
					'attributes':['price'],
					'where':{
						'distance':{
							$lte:data.fields.warehouse_to_closest_distance
						}
					},
					'order': 'distance DESC'
				});
			}

			return promiseObject(data);

		}).then(function(data){

			if (data.fields.do_pickup || data.fields.do_send){
				if (data.distance_from_price === null || data.distance_to_price === null){
					throw new errors.NoPriceDataPickSendError();
				}

				if (data.fields.do_pickup){
					data.fields.do_pickup_amount = data.distance_from_price.price;
					data.fields.finalprice += data.distance_from_price.price;
				}

				if (data.fields.do_send){
					data.fields.do_send_amount = data.distance_to_price.price;
					data.fields.finalprice += data.distance_to_price.price;
				}
			}

			
			if (data.fields.duties !== null){
				var codes = data.fields.duties.map(function(duty){
					if (!duty.code){
						throw new errors.NoDutyCodeError();
					} else if (!duty.value || duty.value <= 0){
						throw new errors.NoDutyValueError();
					} else if (!duty.product){
						throw new errors.NoDutyProductNameError();
					} 
					return(duty.code);
				});

				data.duties = _this.Duty.findAll({
					'attributes':['code','amount'],
					'where':{
						code:{
							'$in':codes
						}
					}
				});
			}

			return promiseObject(data);

		}).then(function(data){

			if (data.duties.length === null){
				throw new InvalidDutyCodeError();
			}

			var dtobj = {};
			data.duties.forEach(function(duty){
				dtobj[duty.get('code')] = duty.get('amount');
			});

			for (i = 0; i < data.fields.duties.length; i++){
				data.fields.duties[i].percent = dtobj[data.fields.duties[i].code];
				if (typeof(data.fields.duties[i].percent) === "undefined"){
					throw new errors.InvalidDutyCodeError();
				}
				data.fields.duties[i].result = data.fields.duties[i].percent*data.fields.duties[i].value;
				data.fields.finalprice += data.fields.duties[i].result;
			};

			return _this.Shipment.create(data.fields);
		})

	}
}

var instanceMethods = {
	changeWarehouse:function(newwar,staff) {
		var curwar = this.getDataValue('warehouse_current');
		var curwartime = this.getDataValue('warehouse_current_time');
		var curstaff = this.getDataValue('warehouse_current_staff');
		this.setDataValue('warehouse_current',newwar);
		this.setDataValue('warehouse_current_time',(new Date()).getTime());
		this.setDataValue('warehouse_current_staff',staff);
		if (curstaff !== null){
			var history = this.get('warehouse_history');
			history.push({
				'time':curwartime,
				'location':curwar,
				'curstaff':curstaff
			});
			this.set('warehouse_history',history);
		}
	},
	putStaffMessage:function(staff,message,warehouse){
		var updates = this.get('update_data');
		updates.push({
			'time':(new Date()).getTime(),
			'warehouse':warehouse,
			'message':message,
			'staff':staff
		});
		this.set('update_data',updates);
	},
	deliver:function(staff){
		this.setDataValue('delivered',(new Date()).getTime());
		this.setDataValue('delivered_by',staff);
	},
	undeliver:function(staff){
		this.setDataValue('delivered',null);
		this.setDataValue('delivered_by',null);
	},
	block:function(staff){
		this.setDataValue('blocked',true);
		this.setDataValue('blocked_by',staff);
	},
	unblock:function(){
		this.setDataValue('blocked',false)
		this.setDataValue('blocked_by',null);
	},
	claim:function(user){
		this.setDataValue('reciever',false);
	},

	__setPaid:function(){
		this.setDataValue('paid',(new Date()).getTime())
	},
}

module.exports = {
	'name':'Shipment',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

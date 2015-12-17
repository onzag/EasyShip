var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var errors = require('../errors/city.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	country:{
		type: Sequelize.TEXT,
		unique:"country_city"
	},
	city:{
		type: Sequelize.TEXT,
		unique:"country_city"
	},
	allow_picksend:{
		type: Sequelize.BOOLEAN
	},
	picksend_amount:{
		type: Sequelize.DECIMAL,
		allowNull:true
	},
	picksend_factor:{
		type:Sequelize.ENUM('+','%'),
		allowNull:true
	},
	'long':{
		type: Sequelize.DECIMAL
	},
	'lat':{
		type: Sequelize.DECIMAL
	}
}

var classMethods = {
	buildFrom: function(country,city,
			allow_pickup,pickup_amount,pickup_factor,
			nlong,nlat){

		return this.City.create({'country':country,'city':city,
				'allow_pickup':allow_pickup,'pickup_amount':pickup_amount,'pickup_factor':pickup_factor,
				'long':nlong,'lat':nlat}).then(function(city){
			return city;
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.CityAlreadyExistsError();
			} else {
				throw err;
			}
		});
	}
}

var instanceMethods = {
	updateCountry:function(country){
		this.setDataValue('country',country);
	},
	updateCity:function(city){
		this.setDataValue('city',city);
	},
	denyPickup:function(){
		this.setDataValue('allow_pickup',false);
		this.setDataValue('pickup_amount',null);
		this.setDataValue('pickup_factor',null);
	},
	allowPickup:function(pickup_amount,pickup_factor){
		this.setDataValue('allow_pickup',true);
		this.setDataValue('pickup_amount',pickup_amount);
		this.setDataValue('pickup_factor',pickup_factor);
	},
	updateLocation:function(nlong,nlat){
		this.setDataValue('long',nlong);
		this.setDataValue('lat',nlat);
	}
}

var validate = {
	validData:function(){
		var allow_pickup = this.getDataValue('allow_pickup');
		var pickup_amount = this.getDataValue('pickup_amount');
		var pickup_factor = this.getDataValue('pickup_factor');

		var contains_picking_data = (pickup_amount !== null || pickup_factor !== null)
		if (allow_pickup === !(contains_picking_data)){
			throw new errors.CityPickupError();
		}
	}
}

module.exports = {
	'name':'City',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

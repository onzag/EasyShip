var Sequelize = require('sequelize');
var errors = require('../errors/country.js');



var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	'name':{
		type: Sequelize.TEXT,
		allowNull:false,
		unique:true
	},
	'currency_id':{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Currencies',
			key:'ID'
		},
		onDelete:'restrict'
	},
	'tariff_currency_id':{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Currencies',
			key:'ID'
		},
		onDelete:'restrict'
	},
	'location':{
		type:'GEOMETRY',
		allowNull:false
	}
}

var classMethods = {
	buildFrom: function(name,currency_id,tariff_currency_id,longitude,latitude){

		if (typeof(name) !== "string"){
			throw new Error('name must be a string');
		} else if (typeof(currency_id) !== "number"){
			throw new Error('currency_id must be a number');
		} else if (typeof(tariff_currency_id) !== "number"){
			throw new Error('tariff_currency_id must be a number');
		} else if (typeof(longitude) !== "number"){
			throw new Error('longitude must be a number');
		} else if (typeof(latitude) !== "number"){
			throw new Error('latitude must be a number');
		}

		return this.Country.create({
			'name':name,
			'currency_id':currency_id,
			'tariff_currency_id':tariff_currency_id,
			'location':{
				'type':'Point',
				coordinates: [longitude,latitude]
			}
		}).then(function(city){
			return city;
		}).catch(function(err){
			if (err instanceof Sequelize.ForeignKeyConstraintError){
				if (err.index === 'currency_id'){
					throw new errors.InvalidTariffCurrencyID();
				} else {
					throw new errors.InvalidCurrencyID();
				};
			} else if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.CountryAlreadyExists();
			} else {
				throw err;
			}
		});
	},
	getOne:function(id){
		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Country.findOne({
			'where':{
				'ID':id
			}
		});
	},
	getCitiesIn:function(id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.City.findAll({
			'where':{
				'country_id':id
			}
		});
	},
	updateNameOf:function(id,name){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(name) !== "string"){
			throw new Error('name must be a string');
		}

		return this.Country.update({
			'name':name
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCountryID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.CountryAlreadyExists();
			} else {
				throw err;
			}
		});
	},
	updateCurrencyOf:function(id,currency_id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(currency_id) !== "number"){
			throw new Error('currency_id must be a number');
		}

		return this.Country.update({
			'currency_id':currency_id
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCountryID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.ForeignKeyConstraintError){
				throw new errors.InvalidCurrencyID();
			} else {
				throw err;
			}
		});
	},
	updateTariffCurrencyOf:function(id,tariff_currency_id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(currency_id) !== "number"){
			throw new Error('tariff_currency_id must be a number');
		}

		return this.Country.update({
			'tariff_currency_id':tariff_currency_id
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCountryID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.ForeignKeyConstraintError){
				throw new errors.InvalidTariffCurrencyID();
			} else {
				throw err;
			}
		});
	},
	updateLocationOf:function(id,longitude,latitude){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(longitude) !== "number"){
			throw new Error('longitude must be a number');
		} else if (typeof(latitude) !== "number"){
			throw new Error('latitude must be a number');
		}

		return this.Country.update({
			'location':{
				'type':'Point',
				coordinates: [longitude,latitude]
			}
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCountryID();
			}
			return ar;
		});
	},
	deleteOne:function(id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.MarketGroup.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				throw new errors.InvalidCountryID();
			}
			return true;
		});
	}
}

var Sequelize = require('sequelize');
var errors = require('../errors/currency.js');

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
	'symbol':{
		type: Sequelize.TEXT,
		allowNull:false,
		validate:{
			len:[1,3]
		}
	}
}

var classMethods = {
	buildFrom: function(name,symbol){

		if (typeof(name) !== "string"){
			throw new Error('name must be a number');
		} else if (typeof(symbol) !== "string"){
			throw new Error('symbol must be a string');
		}

		return this.Currency.create({'name':name,'symbol':symbol}).then(function(currency){
			return currency;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.CurrencyAlreadyExists();
			} else if (err instanceof Sequelize.ValidationError){
				throw new errors.CurrencyValidationError(err.errors);
			} else {
				throw err;
			}
		});
	},
	getOne:function(id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Currency.findOne({
			'where':{
				'ID':id
			}
		});
	},
	updateNameOf:function(id,name){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(name) !== "string"){
			throw new Error('name must be a string');
		}

		return this.Currency.update({
			'name':name
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCurrencyID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.CurrencyAlreadyExists();
			} else if (err instanceof Sequelize.ValidationError){
				throw new errors.CurrencyValidationError(err.errors);
			} else {
				throw err;
			}
		});
	},
	updateSymbolOf:function(id,symbol){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		} else if (typeof(symbol) !== "string"){
			throw new Error('symbol must be a string');
		}

		return this.Currency.update({
			'symbol':symbol
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidCurrencyID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.CurrencyAlreadyExists();
			} else if (err instanceof Sequelize.ValidationError){
				throw new errors.CurrencyValidationError(err.errors);
			} else {
				throw err;
			}
		});
	},
	getCountriesUsing:function(id){
		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Country.findAll({
			'where':{
				'currency_id':id
			}
		});
	},
	getCountriesUsingAsTariff:function(id){
		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Country.findAll({
			'where':{
				'currency_tariff_id':id
			}
		});
	},
	deleteOne:function(id){
		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Currency.destroy({
			'where':{'ID':id}
		}).then(function(dr){
			if (dr === 0){
				throw new errors.InvalidCurrencyID();
			}
			return true;
		});
	}
}

module.exports = {
	'name':'Currency',
	'model':model,
	'classMethods':classMethods
}

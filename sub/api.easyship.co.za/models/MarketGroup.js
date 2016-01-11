var Sequelize = require('sequelize');
var errors = require('../errors/market_group.js');

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
	}
}

var classMethods = {
	buildFrom: function(name){

		if (typeof(name) !== "string"){
			throw new Error('name must be a string');
		}

		return this.MarketGroup.create({'name':name}).then(function(mg){
			return mg;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.MarketGroupAlreadyExists();
			} else {
				throw err;
			}
		});
	},
	getOne:function(id){
		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.MarketGroup.findOne({
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

		return this.MarketGroup.update({
			'name':name
		},{
			'where':{'ID':id}
		}).then(function(ac,ar){
			if (ac === 0){
				throw new errors.InvalidMarketGroupID();
			}
			return ar;
		}).catch(function(err){
			if (err instanceof Sequelize.UniqueConstraintError){
				throw new errors.MarketGroupAlreadyExists();
			} else {
				throw err;
			}
		});
	},
	getCountriesIn:function(id){

		if (typeof(id) !== "number"){
			throw new Error('id must be a number');
		}

		return this.Country.findAll({
			'where':{
				'market_group_id':id
			}
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
				throw new errors.InvalidCurrencyID();
			}
			return true;
		});
	}
}

module.exports = {
	'name':'MarketGroup',
	'model':model,
	'classMethods':classMethods
}

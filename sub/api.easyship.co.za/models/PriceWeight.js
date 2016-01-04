var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var errors = require('../errors/price_weight.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	price:{
		type:Sequelize.DECIMAL,
		allowNull:false,
		unique:true
	},
	weight:{
		type:Sequelize.DECIMAL,
		allowNull:false
	}
}

var classMethods = {
	buildFrom: function(price,weight){
		return this.PriceWeight.create({
			'price':price,
			'weight':weight
		}).then(function(relation){
			return relation;
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.WeightAlreadyExistsError();
			} else {
				throw err;
			}
		});
	}
}

var validate = {
	validData:function(){
		var weight = this.getDataValue('weight');
		if (weight < 0){
			throw new errors.NegativeWeightError();
		}
	}
}

module.exports = {
	'name':'PriceWeight',
	'model':model,
	'classMethods':classMethods,
	'options':{'validate':validate}
}

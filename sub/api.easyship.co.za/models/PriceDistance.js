var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var errors = require('../errors/price_distance.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	price:{
		type:Sequelize.DECIMAL,
		unique:true
	},
	distance:{
		type:Sequelize.DECIMAL
	}
}

var classMethods = {
	buildFrom: function(price,distance){
		return this.PriceDistance.create({
			'price':price,
			'distance':distance
		}).then(function(relation){
			return relation;
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.DistanceAlreadyExistsError();
			} else {
				throw err;
			}
		});
	}
}

var validate = {
	validData:function(){
		var distance = this.getDataValue('distance');
		if (distance < 0){
			throw new errors.NegativeDistanceError();
		}
	}
}

module.exports = {
	'name':'PriceDistance',
	'model':model,
	'classMethods':classMethods,
	'options':{'validate':validate}
}

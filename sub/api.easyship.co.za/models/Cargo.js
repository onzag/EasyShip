var Sequelize = require('sequelize');
var errors = require('../errors/cargo.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	name:{
		type: Sequelize.TEXT,
		unique:true
	},
	description:{
		type: Sequelize.TEXT
	},
	amount:{
		type: Sequelize.DECIMAL
	},
	amount_factor:{
		type:Sequelize.ENUM('+','%')
	}
}

var classMethods = {
	buildFrom: function(name,description,amount,amount_factor){

		return this.Cargo.create({'name':name,'description':description,
				'amount':amount,'amount_factor':amount_factor}).then(function(cargo){
			return city;
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.CargoAlreadyExistsError();
			} else {
				throw err;
			}
		});
	}
}

var instanceMethods = {
	updateName:function(name){
		this.setDataValue('name',name);
	},
	updateDescription:function(description){
		this.setDataValue('description',description);
	},
	updateCharge:function(amount,amount_factor){
		this.setDataValue('amount',amount);
		this.setDataValue('amount_factor',amount_factor);
	}
}

module.exports = {
	'name':'Cargo',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

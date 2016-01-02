var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var ForeignKeyConstraintError = Sequelize.ForeignKeyConstraintError;
var errors = require('../errors/duty.js');

var model = {
	country:{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Countries',
			key:'ID'
		},
		onDelete:'cascade'	
	},

	code:{
		type: Sequelize.TEXT,
		primaryKey:true,
		unique:true
	},

	name:{
		type: Sequelize.TEXT
	},
	description:{
		type: Sequelize.TEXT
	},
	amount:{
		type: Sequelize.DECIMAL
	}
}

var classMethods = {
	buildFrom: function(country,code,name,description,amount){
		return this.Duty.create({
			'country':country,
			'code':code,
			'name':name,
			'description':description,
			'amount':amount
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.CodeAlreadyExistsError();
			} else if (err instanceof ForeignKeyConstraintError){
				throw new errors.CountryDoesNotExistsError();
			} else {
				throw err;
			}
		});
	}
}

var instanceMethods = {
	updateCharge:function(amount){
		this.setDataValue('amount',amount);
	}
}

module.exports = {
	'name':'Duty',
	'model':model,
	'classMethods':classMethods,
	'options':{
		'instanceMethods':instanceMethods
	}
}

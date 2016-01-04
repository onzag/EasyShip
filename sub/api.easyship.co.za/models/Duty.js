var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var ForeignKeyConstraintError = Sequelize.ForeignKeyConstraintError;
var errors = require('../errors/duty.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	country:{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Countries',
			key:'ID'
		},
		onDelete:'cascade',
		unique:'percountry'
	},
	code:{
		type: Sequelize.TEXT,
		allowNull:false,
		unique:'percountry'
	},

	name:{
		type: Sequelize.TEXT,
		allowNull:false
	},
	description:{
		allowNull:false,
		type: Sequelize.TEXT
	},
	amount:{
		allowNull:false,
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

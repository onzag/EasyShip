var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var ForeignKeyConstraintError = Sequelize.ForeignKeyConstraintError;
var errors = require('../errors/city_relation.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	from:{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cities',
			key:'ID'
		},
		onDelete:'cascade'
	},
	to:{
		type: Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cities',
			key:'ID'
		},
		onDelete:'cascade'
	},
	amount:{
		type:Sequelize.DECIMAL
	},
	amount_factor:{
		type:Sequelize.ENUM('+','%')
	},

	disabled:{
		type: Sequelize.BOOLEAN
	}
}

var classMethods = {
	buildFrom: function(from,to,amount,factor,disabled){
		return this.CityRelation.create({
			'from':from,
			'to':to,
			'amount':amount,
			'amount_factor':factor,
			'disabled':disabled
		}).then(function(relation){
			return relation;
		}).catch(function(err){
			if (err instanceof UniqueConstraintError){
				throw new errors.CityRelationAlreadyExistsError();
			} else if (err instanceof ForeignKeyConstraintError) {
				throw new errors.CityDoesNotExistsError();
			} else {
				throw err;
			}
		});
	},
	getAllMissing:function(){

	}
}

var instanceMethods = {
	updateCharge:function(amount,factor){
		this.setDataValue('amount',amount);
		this.setDataValue('amount_factor',factor);
	},
	disable:function(){
		this.setDataValue('disabled',true);
	},
	enable:function(){
		this.setDataValue('disabled',false);
	}
}

var indexes = [
	{'unique':true,fields:['from','to']}
]

module.exports = {
	'name':'CityRelation',
	'model':model,
	'classMethods':classMethods,
	'options':{
		'instanceMethods':instanceMethods,
		'indexes':indexes
	}
}

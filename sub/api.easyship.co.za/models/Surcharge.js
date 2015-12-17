var Sequelize = require('sequelize');
var errors = require('../errors/surcharge.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	name:{
		type:Sequelize.TEXT
	},
	type:{
		type:Sequelize.ENUM('range','day','month')
	},
	from:{
		allowNull:true,
		type:Sequelize.INTEGER.UNSIGNED
	},
	to:{
		allowNull:true,
		type:Sequelize.INTEGER.UNSIGNED
	},
	on:{
		allowNull:true,
		type:Sequelize.INTEGER.UNSIGNED
	},
	amount:{
		type:Sequelize.DECIMAL
	},
	amount_factor:{
		type:Sequelize.ENUM('+','%')
	}
}

var classMethods = {
	buildFromRange: function(name,from,to,amount,factor){
		return this.Surcharge.create({
			'name':name,
			'type':range,
			'from':from,
			'to':to,
			'amount':amount,
			'amount_factor':factor
		});
	},
	buildFromMonth: function(name,on,amount,factor){
		return this.Surcharge.create({
			'name':name,
			'type':'month',
			'on':on,
			'amount':amount,
			'amount_factor':factor
		});
	},
	buildFromDay: function(name,on,amount,factor){
		return this.Surcharge.create({
			'name':name,
			'type':'day',
			'on':on,
			'amount':amount,
			'amount_factor':factor
		});
	}
}

var instanceMethods = {
	updateAmountFactor:function(amount,factor){
		this.setDataValue('amount',amount);
		this.setDataValue('amount_factor',factor);
	}
}

var validate = {
	validData:function(){
		var type = this.getDataValue('type');
		var on = this.getDataValue('on');
		if (type === 'range' && (this.getDataValue('from') === null || this.getDataValue('to') === null || 
			this.getDataValue('to') < this.getDataValue('from') )){
			throw new errors.InvalidDateRange();
		} else if (type && (on < 0 || on >= 7)){
			throw new errors.InvalidDay();
		} else if (type && (on < 0 || on >= 12)){
			throw new errors.InvalidMonth();
		}
	}
}

module.exports = {
	'name':'Surcharge',
	'model':model,
	'classMethods':classMethods,
	'options':{'validate':validate,'instanceMethods':instanceMethods}
}

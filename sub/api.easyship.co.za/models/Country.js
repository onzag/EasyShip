var Sequelize = require('sequelize');
var errors = require('../errors/country.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},
	name:{
		type: Sequelize.TEXT
	},
	'long':{
		type: Sequelize.DECIMAL
	},
	'lat':{
		type: Sequelize.DECIMAL
	},
}

var classMethods = {
	buildFrom: function(name,nlong,nlat){
		return this.Country.create({'name':name,'long':nlong,'lat':nlat}).then(function(country){
			return country;
		});
	}
}

var instanceMethods = {
	updateName:function(name){
		this.setDataValue('name',name);
	},
	updateLocation:function(nlong,nlat){
		this.setDataValue('long',nlong);
		this.setDataValue('lat',nlat);
	}
}

module.exports = {
	'name':'Country',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

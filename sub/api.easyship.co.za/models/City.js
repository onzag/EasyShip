var Sequelize = require('sequelize');
var ForeignKeyConstraintError = Sequelize.ForeignKeyConstraintError;
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var errors = require('../errors/city.js');

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
		unique:'wc'
	},
	name:{
		type: Sequelize.TEXT,
		unique:'wc'
	},
	'long':{
		type: Sequelize.DECIMAL
	},
	'lat':{
		type: Sequelize.DECIMAL
	}
}

var classMethods = {
	buildFrom: function(country,name,nlong,nlat){

		return this.City.create({'country':country,'name':name,
				'long':nlong,'lat':nlat}).then(function(city){
			return city;
		}).catch(function(err){
			if (err instanceof ForeignKeyConstraintError){
				throw new errors.CountryDoesNotExistsError();
			} else if (err instanceof UniqueConstraintError){
				throw new errors.CityNameAlreadyExistsError();
			} else {
				throw err;
			}
		});
	}
}

var instanceMethods = {
	updateCountry:function(country){
		this.setDataValue('country',country);
	},
	updateName:function(name){
		this.setDataValue('name',name);
	},
	updateLocation:function(nlong,nlat){
		this.setDataValue('long',nlong);
		this.setDataValue('lat',nlat);
	}
}

module.exports = {
	'name':'City',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

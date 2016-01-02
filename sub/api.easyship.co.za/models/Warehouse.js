var Sequelize = require('sequelize');
var UniqueConstraintError = Sequelize.UniqueConstraintError;
var ForeignKeyConstraintError = Sequelize.ForeignKeyConstraintError;
var errors = require('../errors/warehouse.js');

var model = {
	ID:{
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey:true,
		autoIncrement: true
	},

	name:{
		type: Sequelize.TEXT,
		allowNull:false
	},
	city:{
		type:Sequelize.INTEGER.UNSIGNED,
		references:{
			model:'Cities',
			key:'ID'
		},
		onDelete:'restrict'
	},
	'long':{
		type: Sequelize.DECIMAL
	},
	'lat':{
		type: Sequelize.DECIMAL
	},
	allow_pickup:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_send:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_personal_put:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_personal_get:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_national_put:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_national_get:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_international_put:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	},
	allow_international_get:{
		type: Sequelize.BOOLEAN,
		allowNull:false
	}
}

var classMethods = {
	buildFrom: function(name,city,nlong,nlat,
		allow_pickup,allow_send,
		allow_personal_put,allow_personal_get,
		allow_national_put,allow_national_get,
		allow_international_put,allow_international_get){
		return this.Warehouse.create({
			'name':name,
			'city':city,
			'long':nlong,
			'lat':nlat,
			'allow_pickup':allow_pickup,
			'allow_send':allow_send,
			'allow_personal_put':allow_personal_put,
			'allow_personal_get':allow_personal_get,
			'allow_national_put':allow_national_put,
			'allow_national_get':allow_national_get,
			'allow_international_put':allow_international_put,
			'allow_international_get':allow_international_get
		}).then(function(city){
			return city;
		}).catch(function(err){
			if (err instanceof ForeignKeyConstraintError){
				throw new errors.CityDoesNotExistError();
			} else {
				throw err;
			}
		});
	}
}

var instanceMethods = {
	updateName:function(name){
		this.setDataValue('name',name);
	}
}

module.exports = {
	'name':'Warehouse',
	'model':model,
	'classMethods':classMethods,
	'options':{'instanceMethods':instanceMethods}
}

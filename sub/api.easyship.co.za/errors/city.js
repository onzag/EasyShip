function CountryDoesNotExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Country does not exists';
}

function CityNameAlreadyExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'City name already exists';
}

module.exports = {
	'CountryDoesNotExistsError':CountryDoesNotExistsError,
	'CityNameAlreadyExistsError':CityNameAlreadyExistsError
}

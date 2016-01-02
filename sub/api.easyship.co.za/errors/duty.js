function CountryDoesNotExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Country does not exists';
}

function CodeAlreadyExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Code Already exists';
}

module.exports = {
	'CountryDoesNotExistsError':CountryDoesNotExistsError,
	'CodeAlreadyExistsError':CodeAlreadyExistsError
}

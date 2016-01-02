function CityDoesNotExistError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'City Does Not Exist';
}

module.exports = {
	'CityDoesNotExistError':CityDoesNotExistError
}

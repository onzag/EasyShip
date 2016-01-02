function CargoAlreadyExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Cargo Already Exists';
}

module.exports = {
	'CargoAlreadyExistsError':CargoAlreadyExistsError
}

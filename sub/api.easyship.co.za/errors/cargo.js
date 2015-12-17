function CargoAlreadyExistsError(){
	this.name = 'CargoAlreadyExistsError';
	this.message = 'Cargo Already Exists';
	this.stack = (new Error()).stack;
}
CargoAlreadyExistsError.prototype = new Error;

module.exports = {
	'CargoAlreadyExistsError':CargoAlreadyExistsError
}

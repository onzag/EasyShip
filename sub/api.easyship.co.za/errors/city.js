function CityAlreadyExistsError(){
	this.name = 'CityAlreadyExistsError';
	this.message = 'City Already Exists';
	this.stack = (new Error()).stack;
}
CityAlreadyExistsError.prototype = new Error;

function CityPickupError(){
	this.name = 'CityPickupError';
	this.message = 'Pickup data for city is invalid';
	this.stack = (new Error()).stack;
}
CityPickupError.prototype = new Error;

module.exports = {
	'CityAlreadyExistsError':CityAlreadyExistsError,
	'CityPickupError':CityPickupError
}

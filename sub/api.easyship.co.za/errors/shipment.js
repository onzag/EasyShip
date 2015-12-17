function CityFromError(){
	this.name = 'CityFromErrorError';
	this.message = 'The City Where the Shipment Comes From doesn\'t Exist';
	this.stack = (new Error()).stack;
}
CityFromError.prototype = new Error;

function CityToError(){
	this.name = 'CityToError';
	this.message = 'The City Where the Shipment Goes To doesn\'t Exist';
	this.stack = (new Error()).stack;
}
CityToError.prototype = new Error;

function CityPickupError(){
	this.name = 'CityPickupError';
	this.message = 'The City Where the Shipment wants to be picked from an address is not Applicable';
	this.stack = (new Error()).stack;
}
CityPickupError.prototype = new Error;

function CitySendError(){
	this.name = 'CityPickupError';
	this.message = 'The City Where the Shipment wants to be sent to an address is not Applicable';
	this.stack = (new Error()).stack;
}
CitySendError.prototype = new Error;

function RelationDisabledError(){
	this.name = 'RelationDisabledError';
	this.message = 'The relation between those cities is disabled';
	this.stack = (new Error()).stack;
}
RelationDisabledError.prototype = new Error;

function RelationError(){
	this.name = 'RelationError';
	this.message = 'There\'s no Relation Between Those Cities';
	this.stack = (new Error()).stack;
}
RelationError.prototype = new Error;

function InvalidCargoError(){
	this.name = 'InvalidCargoError';
	this.message = 'Such cargo type does not exist';
	this.stack = (new Error()).stack;
}
InvalidCargoError.prototype = new Error;

function NoPriceDataError(){
	this.name = 'NoPriceDataError';
	this.message = 'There\'s no Data Associated with the Product';
	this.stack = (new Error()).stack;
}
NoPriceDataError.prototype = new Error;

module.exports = {
	'CityFromError':CityFromError,
	'CityToError':CityToError,
	'RelationError':RelationError,
	'NoPriceDataError':NoPriceDataError
}

function CityFromError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'The City Where the Shipment Comes From doesn\'t Exist';
}

function CityToError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'The City Where the Shipment Goes To doesn\'t Exist';
}

function NoDutiesError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'In cross-country trips duties are required';
}

function DutiesSpecifiedError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'In non-cross-country trips duties are not required';
}

function NoDutyCodeError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'In cross-country trips a duty code is required';
}

function NoDutyValueError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'In cross-country trips the value of the shipment is required';
}

function NoDutyProductNameError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'In cross-country trips the name of the shipment is required';
}

function InvalidDutyCodeError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Invalid Duty Code';
}

function NoWarehousesFromError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Cannot find warehouses in such city from';
}

function NoWarehousesToError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Cannot find warehouses in such city to';
}

function InvalidCargoError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Such cargo type does not exist';
}

function NoPriceWeightDataError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'There\'s no Data Associated with the Product That Weight';
}

function NoPriceDistanceDataError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'There\'s no Data Associated with the Product That Weight';
}

function NoPriceDataPickSendError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'There\'s no Data Associated with the Product to Pick or Send';
}

module.exports = {
	'CityFromError':CityFromError,
	'CityToError':CityToError,
	'NoDutiesError':NoDutiesError,
	'DutiesSpecifiedError':DutiesSpecifiedError,
	'NoDutyCodeError':NoDutyCodeError,
	'NoDutyValueError':NoDutyValueError,
	'NoDutyProductNameError':NoDutyProductNameError,
	'InvalidDutyCodeError':InvalidDutyCodeError,
	'NoWarehousesFromError':NoWarehousesFromError,
	'NoWarehousesToError':NoWarehousesToError,
	'InvalidCargoError':InvalidCargoError,
	'NoPriceWeightDataError':NoPriceWeightDataError,
	'NoPriceDataPickSendError':NoPriceDataPickSendError
}

function DistanceAlreadyExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Distance was Already Defined';
}

function NegativeDistanceError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Distance is negative';
}

module.exports = {
	'DistanceAlreadyExistsError':DistanceAlreadyExistsError,
	'NegativeDistanceError':NegativeDistanceError
}

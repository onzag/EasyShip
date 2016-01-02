function WeightAlreadyExistsError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Weight was Already Defined';
}

function NegativeWeightError(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'Weight is negative';
}

module.exports = {
	'WeightAlreadyExistsError':WeightAlreadyExistsError,
	'NegativeWeightError':NegativeWeightError
}

function WeightAlreadyExistsError(){
	this.name = 'WeightAlreadyExistsError';
	this.message = 'Weight was Already Defined';
	this.stack = (new Error()).stack;
}
WeightAlreadyExistsError.prototype = new Error;

function NegativeWeightError(){
	this.name = 'NegativeWeightError';
	this.message = 'Weight is negative';
	this.stack = (new Error()).stack;
}
NegativeWeightError.prototype = new Error;

module.exports = {
	'WeightAlreadyExistsError':WeightAlreadyExistsError,
	'NegativeWeightError':NegativeWeightError
}

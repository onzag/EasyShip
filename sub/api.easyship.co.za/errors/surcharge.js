function InvalidDateRange(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'The Provided Date Range is Invalid';
}

function InvalidDay(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'The Day is Invalid';
}

function InvalidMonth(){
	this.constructor.prototype.__proto__ = Error.prototype;
	Error.call(this)
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name;
	this.message = 'The Month is Invalid';
}

module.exports = {
	'InvalidDateRange':InvalidDateRange,
	'InvalidDay':InvalidDay,
	'InvalidMonth':InvalidMonth
}

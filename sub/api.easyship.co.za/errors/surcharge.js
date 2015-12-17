function InvalidDateRange(){
	this.name = 'InvalidDateRange';
	this.message = 'The Provided Date Range is Invalid';
	this.stack = (new Error()).stack;
}
InvalidDateRange.prototype = new Error;

function InvalidDay(){
	this.name = 'InvalidDay';
	this.message = 'The Day is Invalid';
	this.stack = (new Error()).stack;
}
InvalidDay.prototype = new Error;

function InvalidMonth(){
	this.name = 'InvalidMonth';
	this.message = 'The Month is Invalid';
	this.stack = (new Error()).stack;
}
InvalidMonth.prototype = new Error;

module.exports = {
	'InvalidDateRange':InvalidDateRange,
	'InvalidDay':InvalidDay,
	'InvalidMonth':InvalidMonth
}

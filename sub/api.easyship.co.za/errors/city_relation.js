function CityRelationAlreadyExistsError(){
	this.name = 'CityRelationAlreadyExistsError';
	this.message = 'City Relation Already Exists';
	this.stack = (new Error()).stack;
}
CityRelationAlreadyExistsError.prototype = new Error;

function CityDoesNotExistsError(){
	this.name = 'CityDoesNotExistsError';
	this.message = 'City Does Not Exist';
	this.stack = (new Error()).stack;
}
CityDoesNotExistsError.prototype = new Error;

module.exports = {
	'CityRelationAlreadyExistsError':CityRelationAlreadyExistsError,
	'CityDoesNotExistsError':CityDoesNotExistsError
}

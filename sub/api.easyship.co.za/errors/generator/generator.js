function generateError(name){
	return (function(data){
		this.constructor.prototype.__proto__ = Error.prototype;
		Error.call(this)
		Error.captureStackTrace(this, this.constructor)
		this.name = name;
		this.data = data;
	});
}

function generateMany(){
	var names  = Array.prototype.slice.call(arguments);
	var rs = {};
	names.forEach(function(name){
		rs[name] = generateError(name);
	});
	return rs;
}

module.exports = generateMany;

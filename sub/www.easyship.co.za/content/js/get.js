(function(){
	window.QUERY = {};

	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var vardata = vars[i];
		var equalloc = vardata.indexOf('=');
		if (equalloc < 0){
			window.QUERY[decodeURIComponent(vars[i])] = true;
		} else {
			var varname = decodeURIComponent(vardata.substring(0,equal));
			var varval = decodeURIComponent(vardata.substring(equal+1));
			window.QUERY[varname] = varval;
		}
	}
})();

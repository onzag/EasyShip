var cp = require('child_process');
var config = require(process.argv[2] + '/config.js');

if (config.DYNAMIC){
	var hosts = (config.DYNAMICHOST instanceof Array) ? config.DYNAMICHOST : [config.DYNAMICHOST]; 
	hosts.forEach(function(dt){
		var host = dt.host;
		var port = dt.port;
		if (host === 'localhost'){
			var child = cp.fork('./init.js', [process.argv[2],port]);
			child.on('close',close.bind(null,port));
			child.on('message',messagehandler);
		} else {
			console.log('Not localhost, ' + host + ', ignoring...')
		}
	});
}

function stdout(data){
	console.log(data);
}

function stderr(data){
	console.error(data);
}

function close(port,status){
	console.error('Server in port ' + port + ' died out with status ' + status + '; respawning...');

	var child = cp.fork('./init.js', [process.argv[2],port]);
	child.on('close',close.bind(null,port));
	child.on('message',messagehandler);
}

function messagehandler(type,data){
	
}

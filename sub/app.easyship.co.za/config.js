var config = {
	HIDDEN:false,
	ERR404:'/404.html',

	DYNAMIC:false,
	DYNAMICHOST:null,
	DYNAMICURL:null,

	STATIC:true,
	STATICURL:'/',
	STATICFOLDER:'content',
	STATICLIFETIME:"10d",
	STATICHEADERS:{
		'Access-Control-Allow-Origin':'easyship.co.za',
		'Access-Control-Allow-Credentials':'true',
		'Access-Control-Allow-Methods':'GET, POST, OPTIONS, PATCH, UPDATE, PUT',
		'Access-Control-Allow-Headers':'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type'
	}
};
module.exports = config;

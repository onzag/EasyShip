var config = {
	HIDDEN:true,
	ERR404:null,

	DYNAMIC:true,
	DYNAMICHOST:[
		{host:'localhost',port:8000},
		{host:'localhost',port:8001}
	],
	DYNAMICURL:'/',

	STATIC:false,
	STATICURL:null,
	STATICFOLDER:null,
	STATICLIFETIME:null
};
module.exports = config;

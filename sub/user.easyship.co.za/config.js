var config = {
	HIDDEN:false,
	ERR404:'/404.html',

	DYNAMIC:true,
	DYNAMICHOST:[
		{host:'localhost',port:8100},
		{host:'localhost',port:8101}
	],
	DYNAMICURL:['/metalogin/'],

	STATIC:false,
	STATICURL:null,
	STATICFOLDER:null,
	STATICLIFETIME:null,
	STATICHEADERS:null
};
module.exports = config;

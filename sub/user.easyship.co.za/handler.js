var HOSTNAME = 'http://user.easyship.co.za/';
var MG_API_KEY = 'key-e14645070f241e43b0febcbe48edb4ac';
var MG_DOMAIN = 'sandboxf13fa1c64d714eaca2afb1bf8b33b036.mailgun.org';
var MG_GENERAL_MASTER = 'postmaster@sandboxf13fa1c64d714eaca2afb1bf8b33b036.mailgun.org';
var MG_STAFF_MASTER = 'postmaster@sandboxf13fa1c64d714eaca2afb1bf8b33b036.mailgun.org';

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var SQLiteStore = require('connect-sqlite3')(require('express-session'));
var auth = {
	auth: {
		api_key:MG_API_KEY,
		domain:MG_DOMAIN
	}
}

var bcrypt = require('bcrypt');
var Metalogin = require('./metalogin');
var meta = new Metalogin({
	isProxy:true,
	database:{
		uri:'sqlite://test.sqlite',
		options:{logging:false}
	},
	successURL:'/index.html?lsuccess',
	failureURL:'/index.html?lfailed',
	logoutURL:'/index.html',
	hostname:HOSTNAME,

	providers:[{
		strategy:Metalogin.strategies.local,
		data:{}
	}],

	//mail design
	mail:{
		transport:nodemailer.createTransport(mg(auth)),
		design:{
			validate:function(user,code,done){
				done(null,{
					from:MG_GENERAL_MASTER,
					to:user.email,
					subject:'EasyShip Validation',
					html:('<a href="' + HOSTNAME + '/validate.html?id=' + 
						encodeURIComponent(user.ID) + '&code=' + 
						encodeURIComponent(code) + '">Click here to validate your email</a>')
				});
			},
			recover:function(user,code,done){
				done(null,{
					from:MG_GENERAL_MASTER,
					to:user.email,
					subject:'Recover your EasyShip Account',
					text:('<a href="' + HOSTNAME + '/recover.html?id=' + 
						encodeURIComponent(user.ID) + '&code=' + 
						encodeURIComponent(code) + '">Click here to recover your account</a>')
				});
			}
		},
		models:{
			staff:function(targetuser,user,subject,text,done){
				done(null,{
					from:MG_STAFF_MASTER,
					to:targetuser.email,
					subject:'EasyShip Staff - ' + subject,
					text:text + (user ? ' (sent by ' + user.username + ')' : '')
				});
			}
		}
	},

	//client role, the default for the clients,
	//staff and supervisor user other interfaces
	roles:['client','staff','supervisor'],

	//default signature to act with the API
	signatures:{
		'default':{
			jwt:{
				expiresIn:10
			},
			secret:'jotiLC9639FNlWKdVhELNQjcBnExOkKdCDkrFUBaXoQRHgiubWHdOZQFBZVxsntFU2Z7YI3cwWjeabhtE8CxmQD6Kperb39mqINjOLNowPyUSJYiW6D8EBhNT5lRqvbd',
			fields:['email','role','username','ID']
		}
	},

	//On new user, check the security data for the questions and answers
	onNewUser:function(user,data,done){
		if (user.provider === 'local'){
			var securityQuestions;
			try {
				securityQuestions = JSON.parse(data);
				if (typeof(securityQuestions) !== "object"){
					return done(null,false,'Invalid Security Data');
				} 
			} catch(e) {
				return done(null,false,'Invalid Security Data');
			}

			try {
				for (question in securityQuestions){
					securityQuestions[question] = securityQuestions[question].toLowerCase().replace(/ /g,'');
				}
			} catch(e){
				return done(null,false,'Invalid Security Data');
			}

			user.set('appMetadata',{'security':securityQuestions});
		}
		return done(null,true);
	},

	//On login allow anyone
	onLogin:function(user,data,done){
		return done(null,true);
	},

	//onStrategy allow anyone
	onStrategy:function(provider,action,role,user,data,done){
		return done(null,true);
	},

	//on self get only allow certain fields
	onSelfGet:function(user,field,data,done){
		if (field !== 'ID' || field !== 'username' ||
			field !== 'picture' || field !== 'role' ||
			field !== 'validated' || field !== 'email'){
			return done(null,false);
		}
		return done(null,true);
	},

	//on self metadata get deny everyone
	onSelfMetadataGet:function(type,user,field,data,done){
		return done(null,false);
	},

	//on self set allow only username
	onSelfSet:function(user,field,value,data,done){
		if (field === 'username'){
			return done(null,false);
		} //else if (field === 'picture'){
			//check for valid picture No XSS allowed
		//}
		return done(null,false);
	},

	//on self metadata set deny everyone
	onSelfMetadataSet:function(type,user,field,value,data,done){
		return done(null,false);
	},

	//on self change password check for old password
	onSelfChangePassword:function(user,password,data,done){
		var oldpassword = data;
		bcrypt.compare(oldpassword,user.get('password'),function(err,valid){
			if (err){
				return done(err);
			}
			if (!valid){
				return done(null,false,"Invalid old password");
			}
			done(null,true);
		});
	},

	//on validation send allow anyone
	onSelfSendValidation:function(user,data,done){
		return done(null,true);
	},

	//on self token get allow anyone get any signature
	onSelfTokenGet:function(user,signature,data,done){
		return done(null,true);
	},

	//on users get  allow a client only if he searchs for an specific
	//email, otherwise deny, however if it's staff or supervisor, allow more
	onUsersGet:function(criteria,fields,user,data,done){
		var len = 0;
		for (attrs in criteria){
			len++;
		}

		if (user && user.role !== 'client'){
			var badfields = ['validation_code','validation_sent',
				'recovery_code','recovery_expiration','recovery_sent',
				'raw','appMetadata','userMetadata'];
			var bad = false;
			badfields.forEach(function(bfield){
				if (fields.indexOf(bfield) >= 1){
					bad = true;
				}
			});
			if (bad){
				return done(null,false);
			} else {
				return done(null,true);
			}
		} else if (typeof(criteria.email) === "string" && criteria.provider === 'local' && len === 2){

			var badfields = ['email','provider','role','validated',
				'password','validation_code','validation_sent',
				'recovery_code','recovery_expiration','recovery_sent',
				'raw','appMetadata','userMetadata'];
			var bad = false;
			badfields.forEach(function(bfield){
				if (fields.indexOf(bfield) >= 1){
					bad = true;
				}
			});
			if (bad){
				return done(null,false);
			} else {
				return done(null,true);
			}

		}
		return done(null,false);
	},

	//deny if it's client or unknown, otherwise allow
	onUsersAmountGet:function(criteria,user,data,done){
		if (user && user.role !== 'client'){
			return done(null,true);
		}
		return done(null,false);
	},

	//Allow any if part of the staff, otherwise if it's a client
	//only allow them to get the basic fields, such as username and picture,
	//anything else is denied
	onUserGet:function(targetuser,fields,user,data,done){
		if (user && user.get('role') !== 'client'){
			return done(null,true);
		} else if (user && user.get('role') === 'client'){
			var badfields = ['email','provider','role','validated',
				'password','validation_code','validation_sent',
				'recovery_code','recovery_expiration','recovery_sent',
				'raw','appMetadata','userMetadata'];
			var bad = false;
			badfields.forEach(function(bfield){
				if (fields.indexOf(bfield) >= 1){
					bad = true;
				}
			});
			if (bad){
				return done(null,false);
			} else {
				return done(null,true);
			}
		}
		return done(null,false);
	},

	//Only if staff
	onUserMetadataGet:function(type,targetuser,field,user,data,done){
		if (user && user.role !== 'client'){
			return done(null,true);
		}
		return done(null,false);
	},

	//Don't allow anyone to do this
	onUserSet:function(targetuser,field,value,user,data,done){
		return done(null,false);
	},

	//Much less allowed
	onUserMetadataSet:function(type,targetuser,field,value,user,data,done){
		return done(null,false);
	},

	//only staff can send messages
	onUserSendMessage:function(targetuser,model,subject,text,user,data,done){
		if (user && user.role !== 'client'){
			return done(null,true);
		}
		return done(null,false);
	},

	//only if security question was answered properly
	onUserSendRecovery:function(targetuser,user,data,done){
		var security;
		try {
			security = JSON.parse(data);
		} catch(e){
			return done(null,false,'Invalid JSON data');
		}
		if (user.get('appMetadata')['security'][security.question] === security.answer){
			return done(null,true);
		} else {
			return done(null,false,'Invalid Security Answer');
		}
	},

	//allow anyone to recover without blockers
	onUserRecovery:function(targetuser,npassword,user,data,done){
		return done(null,true);
	},

	//Don't allow this, it'd be crazy
	onUserTokenGet:function(targetuser,signature,user,data,done){
		return done(null,false);
	},

	//allow only staff to see the dev log
	onLogGet:function(user,data,done){
		if (user && user.role !== 'client'){
			return done(null,true);
		}
		return done(null,false);
	}
})

module.exports = function(app,done){
	meta.sync().then(function(){

		meta.autoconfigure(app,
			'yl9NHQYGAFaPhiPtOv1tD4jfQK26LDoIJHA3A4ACI9hmWmPvo6mvSGbYVSAjBGi2RfS22YOEIeVw6bar8GBH0VVRiwSskmLhjFVYby1mqGDzS4cQxpLC5cEdeaElXOgf',
			{
				proxy:true,
				store: new SQLiteStore(),
				table:'sessions',
				db:'test.sqlite',
				dir:'.'
			});
		app.use(meta.initialize());

		done(null);
	}).catch(done);
}

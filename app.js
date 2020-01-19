const http = require('http');
const https = require('https');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const request = require('request');
const session = require('express-session')
const csrf = require('csurf')
const flatten = require('flat')
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const Big = require('big.js');
const {promisify} = require('util');
const sqlite3 = require('sqlite3');
const asyncv3	  = require('async');


// Qredit Libs
const qreditjs 	= require("qreditjs"); 
const qreditApi = require("nodeQreditApi");

const qapi = new qreditApi.default();

var indexRouter = require('./routes/index');

var serverPort = 8080;

var app = express();


var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(serverPort);



////
// Web Stuff

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'justsomerandomness191919', resave: false, saveUninitialized: true, cookie: { maxAge: 864000 }}));
app.use(csrf());

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


////
// Socket IO Stuff

io.on('connection', function (socket) {

    socket.on('getapifields', function (input) {
    
        var apiurl = input.apiurl;
        
        request.get({url:apiurl}, function(err, response, body) {
        
        	if (!err)
        	{
        	
        		var jsonbody = JSON.parse(body);
        		
        		var flatjson = flatten(jsonbody);
        		        		
        		var keys = Object.keys(flatjson);
        	
        		socket.emit('parsedApiFields', keys);
        
        	}
        
        });
        
    });
    
    socket.on('getapidata', function (input) {
    
    	var apiurl = input.apiurl;
        var datamapjson = JSON.parse(input.datamapjson);
        
        request.get({url:apiurl}, function(err, response, body) {
        
        	if (!err)
        	{
        	
        		var jsonbody = JSON.parse(body);
        		
        		var flatjson = flatten(jsonbody);
        		
        		var keys = Object.keys(flatjson);
        		
        		var newjson = {};
        		
        		keys.forEach(function(key){
        		
        			if (datamapjson[key] && datamapjson[key] != null)
        			{
        		
        				newjson[datamapjson[key]] = flatjson[key];
        				
        			}
        		
        		});
        	
        		socket.emit('parsedApiData', {'QDS': newjson});
        
        	}
        
        });
        
    });
    
    socket.on('setprivatekey', function (input) {
    
    	var pKey = input.privkey;
    	
    	(async () => {
    	
			var keys = qreditjs.crypto.getKeys(pKey);
			var publickey = keys.publicKey;
			var privatekey = keys.d.toBuffer().toString("hex");
			var newaddress = qreditjs.crypto.getAddress(publickey);
    	
    		var balance = await qapi.getWalletBalance(newaddress);
    		
    		var newjson = {};
    		newjson.address = newaddress;
    		newjson.balance = balance;
    		    		
        	socket.emit('getKeyDetails', newjson);

		})();
        
    });
    
    
    socket.on('querydatabase', function (input) {
    
    	var sessionid = input.sessionid;
    	var query = input.query;
    	
		let db = new sqlite3.Database('./db/' + sessionid + '.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the ' + sessionid + ' database.');
		});
		
		
		db.all(query, function(err, rows) {
		
			if (err)
			{
				socket.emit('queryResults', err);
				
			}
			else
			{
			
				socket.emit('queryResults', JSON.stringify(rows));
				
			}
	
		});	
        
    });
    
    
    socket.on('createtransaction', function (input) {
    
    	var pKey = input.privKey;
    	var vendorField = input.vendorField;
    	
		//var keys = qreditjs.crypto.getKeys(pKey);
		//var publickey = keys.publicKey;
		//var privatekey = keys.d.toBuffer().toString("hex");
		//var toAddress = qreditjs.crypto.getAddress(publickey);
		
		var toAddress = 'QgskPMXNNPz5KjebYcaAdgzcxFPKJu9z5K'; // Mike Testing Wallet
        
        var transaction = qreditjs.transaction.createTransaction(toAddress, 1, vendorField, pKey);

        (async () => {
        
        	var result = await qapi.createTransaction([transaction]);
        	
        	if (result.data && result.data.accept[0] == transaction.id)
        	{
        
        		socket.emit('transactionResult', transaction.id);
        		
        	}
        	else
        	{
        	
        		socket.emit('transactionResult', 'Error');
        	
        	}

		})();
        
    });
    

    socket.on('builddatabase', function (input) {
    
    	var sessionid = input.sessionid;
    	var datefrom = input.datefrom + ' 00:00:00';
    	var dateto = input.dateto + ' 23:59:59';
    	var jsonmap = JSON.parse(input.jsonmap);
    	var revjsonmap = JSON.parse(input.revjsonmap);
    	var privkey = input.privkey;
    	var sql = '';
    	
		var keys = qreditjs.crypto.getKeys(privkey);
		var publickey = keys.publicKey;
		var privatekey = keys.d.toBuffer().toString("hex");
		var fromAddress = qreditjs.crypto.getAddress(publickey);
    	
    
		let db = new sqlite3.Database('./db/' + sessionid + '.db', (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the ' + sessionid + ' database.');
		});
		
		


		sql = "DROP TABLE IF EXISTS databuilder";
		db.run(sql, [], function(err) {
		  if (err) {
			console.log("Delete sqlite table");
			console.log(err.message);
		  }
		});

		var fields = Object.keys(jsonmap);
		
console.log(fields);

		var createfields = fields.join('" TEXT, "');
		var sql = "CREATE TABLE IF NOT EXISTS databuilder (\"" + createfields + "\" TEXT)";
		
console.log(sql);
    
		db.run(sql, [], function(err) {
		  if (err) {
			console.log("Create sqlite table");
			console.log(err.message);
		  }
		});
		
		var unixtoepoch = 1490101200;
		
		var epochfrom = (Date.parse(datefrom)/1000) - unixtoepoch;
		var epochto = (Date.parse(dateto)/1000) - unixtoepoch;
		
		var page = 1;
		var limit = 100;
		var body = {};
		body.senderId = fromAddress;
		body.timestamp = {from: epochfrom, to: epochto};
		
		socket.emit('buildingDatabaseMessage', 'Starting Build...');
		
        (async () => {
        
        	var result = await qapi.searchTransactions(page, limit, body);
        	
        	if (result.data)
        	{
        	
        		var pagecount = result.meta.pageCount;
        		
        		await whilstScanTransactions(result.data, db, revjsonmap, fields);
        		
        		if (pagecount > 1)
        		{
        		
        			for (let i = 2; i <= pagecount; i++)
        			{
        				
        				result = await qapi.searchTransactions(i, limit, body);
        				await whilstScanTransactions(result.data, db, revjsonmap, fields);
        			
        			}
        		
        		}
        		
				sql = "SELECT count(*) AS totcount FROM databuilder";
				db.get(sql, [], (lerr, lrow) => {


					if (lrow)
					{
						var insertcount = lrow.totcount;
					}
					else
					{
						var insertcount = 0;
					}
			
					socket.emit('buildingDatabaseMessage', 'Inserted ' + insertcount + ' records');
					socket.emit('buildingDatabaseReset', true);
					socket.emit('datasetCanQuery', true);
				
				});
        		
        	
        	}
        	else
        	{
        	
        		socket.emit('buildingDatabaseMessage', 'Error:  No transactions in date range');
        		socket.emit('buildingDatabaseReset', true);
        		
        	}

		})();
		
    });
    
});


async function whilstScanTransactions(data, db, revjsonmap, fields)
{

	var count = 0;
	var max = data.length;
	var sql = '';

	return new Promise((resolve) => {

		asyncv3.whilst(
			function test(cb) { cb(null, count < max) },
			function iter(callback) {

				var item = data[count];

				count++;

				(async () => {
				
					try {
					
						var vendorJsonRaw = JSON.parse(item.vendorField);
						
						var vendorJson = vendorJsonRaw['QDS'];

console.log(vendorJson);

						var revjsonkeys = Object.keys(revjsonmap);
						var vendorjsonkeys = Object.keys(vendorJson);

console.log(revjsonkeys);
console.log(vendorjsonkeys);


						if (revjsonkeys.length == vendorjsonkeys.length && vendorjsonkeys.length > 0)
						{
						
							// Ok.. Continue

console.log('OK - CONTINUE');

							let insertfields = fields.join('", "');
							
							let qmarks = [];
							let ldata = [];
							for (let i = 0; i < revjsonkeys.length; i++)
							{
								qmarks.push('?');
								
								let jkeyname = revjsonkeys[i];
								
								ldata.push(vendorJson[jkeyname])
							}
							let insertqmarks = qmarks.join(',');
							
							sql = "INSERT INTO databuilder (\"" + insertfields + "\") VALUES (" + insertqmarks + ")";
							
console.log(sql);
console.log(ldata);
														
							db.run(sql, ldata, function(err) {
								if (err) {
									console.log("Sqlite Insert Error");
									console.log(err.message);
									callback(null, count);
								}
								else
								{
console.log('SQL INSERTED');
									callback(null, count);
								}
								
							});
							
							
							
						}
						else
						{

console.log('headers no match');
							callback(null, count);

						}
					
					} catch (e) {
					
						// skip record
console.log('skipping record');
						callback(null, count);
					
					}
					
				})();

			},
			function(err, n) {
		
				(async () => {
				
					resolve(true);
		
				})();
			
			}
		
		);

	});

}



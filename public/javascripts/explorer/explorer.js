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
const {
    promisify
} = require('util');
const sqlite3 = require('sqlite3');
const asyncv3 = require('async');


// Qredit Libs
const qreditjs = require("qreditjs");
const qreditApi = require("nodeQreditApi");
const qaeApi = require("nodeQaeApi");

const qapi = new qreditApi.default();
const qaeapi = new qaeApi.default();

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
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'justsomerandomness191919',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 864000
    }
}));
app.use(csrf());

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Socket IO Stuff

io.on('connection', function (socket) {

    // Socket IO getdelegates

    socket.on('gettokenlist', function (input) {

        var page = input.page;
        var limit = input.limit;

        (async () => {

            var data = await qaeapi.listTokens(100, 1);

            var flatJson = [];

            for (let i = 0; i < data.length; i++) {
                let tempJson = {
                    version: data[i].type,
                    name: data[i].tokenDetails.name,
                    symbol: data[i].tokenDetails.symbol,
                    owneraddress: data[i].tokenDetails.ownerAddress,
                    tokenid: data[i].tokenDetails.tokenIdHex,
                    circsupply: Big(data[i].tokenStats.qty_token_circulating_supply).div(Big(10).pow(data[i].tokenDetails.decimals)).toFixed(data[i].tokenDetails.decimals),
                    pausable: data[i].tokenDetails.pausable == true ? '<i class="nav-icon i-Yes font-weight-bold"style="color:green;"></i>' : '<i class="nav-icon i-Close-Window font-weight-bold" style="color:red;"></i>',
                    mintable: data[i].tokenDetails.mintable == true ? '<i class="nav-icon i-Yes font-weight-bold" style="color:green;"></i>' : '<i class="nav-icon i-Close-Window font-weight-bold" style="color:red;"></i>'

                };
                flatJson.push(tempJson);
            }

            socket.emit('qaetokenlist', flatJson);

        })();

    });

    // Socket IO getdelegates

    socket.on('getdelegates', function (input) {

        (async () => {

            var response = await qapi.listDelegates();
            var data = response.data;

            var flatJson = [];
            for (let i = 0; i < data.length; i++) {
                let tempJson = {
                    rank: data[i].rank,
                    username: data[i].username
                };
                flatJson.push(tempJson);
            }

            socket.emit('showdelegates', flatJson);

        })();

    });

    // Socket IO getblocks

    // Socket IO getpeers

    // Socket IO gettransactions

    // Socket IO getwallets/top  

})
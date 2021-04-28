var express = require('express');
var http = require('http');
var session = require('express-session');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var serverConfig = require('./config/config');
var login = require('./login');
var auth = require('./auth');

var app = express();
var router = express.Router();
app.set('port', serverConfig.server.port || process.env.PORT);
app.set('host', serverConfig.server.host || 'localhost');
app.use(session({
    secret : 'secretWords',
    resave : false,
    saveUninitialized : true
}));
app.use('/public', static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

router.route('/').get(function(req, res){
    //var mainPage = fs.readFileSync('임의의파일', 'utf8');
    res.write('hihi');
    res.end();
});

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
    console.log('Start Express Server!!');
    console.log('Try DB connect');
    serverConfig.connection = mysql.createConnection({
        host : serverConfig.db.host,
        user : serverConfig.db.user,
        password : serverConfig.db.password,
        database : serverConfig.db.database
    });
    serverConfig.connection.connect();
    console.log('DB connected');
    console.log('Login Router 설정');
    login(router, serverConfig.connection, session);
    console.log('Kakao Login 설정');
    auth(router, session);
    console.log('Board Router 설정');
    console.log('Router 등록');
    app.use('/', router);
});
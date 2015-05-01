require( './config/db' );

var Cluster = require('cluster2');
var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var engine         = require( 'ejs-locals' );
var cookieParser   = require( 'cookie-parser' );
var bodyParser     = require( 'body-parser' );
var methodOverride = require( 'method-override' );
var static         = require('serve-static');
var morgan = require('morgan');
var fs = require('fs');
var validator = require('express-validator');
var compression = require('compression');
var csrf = require('csurf');
var session = require('express-session');
var helmet = require('helmet');

var favicon = require('serve-favicon');


var app    = express();
app.use(favicon(__dirname + '/public/favicon.ico'));

var routes = require( './routes' );



app.set( 'port', process.env.PORT || 3001 );
app.engine( 'ejs', engine );
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'ejs' );
app.use( methodOverride());
app.use( cookieParser("secretKey"));
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true }));

app.use(validator());

app.use(csrf({cookie:true}));
app.use(helmet());


app.use(function(req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});


app.use( routes.current_user );
app.get(  '/',            routes.index );
app.post( '/create',      routes.create );
app.get(  '/destroy/:id', routes.destroy );
app.get(  '/edit/:id',    routes.edit );
app.post( '/update/:id',  routes.update );

var env = app.get('env');
app.use(compression({level: 9,memLevel: 9}));
app.use(static(path.join( __dirname, 'public'),{maxAge: 31557600000/1000}));


if(env=="production"){
	var accessLogStream = fs.createWriteStream(__dirname + '/logs/urls.log', {flags: 'a'})
	app.use(morgan('combined', {stream: accessLogStream}));
	require( './config/errors' )(app);
}else{
	app.use(morgan());
}


var c = new Cluster({
    port: 3000,
});
c.listen(function(cb) {
    cb(app);
});
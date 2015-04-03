require( './config/db' );

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


var app    = express();
var routes = require( './routes' );


app.set( 'port', process.env.PORT || 3001 );
app.engine( 'ejs', engine );
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'ejs' );
app.use( methodOverride());
app.use( cookieParser());
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true }));
app.use(validator());
app.use( routes.current_user );
app.get(  '/',            routes.index );
app.post( '/create',      routes.create );
app.get(  '/destroy/:id', routes.destroy );
app.get(  '/edit/:id',    routes.edit );
app.post( '/update/:id',  routes.update );

var env = app.get('env');

app.use(static(path.join( __dirname, 'public')));

if(env=="production"){
	var accessLogStream = fs.createWriteStream(__dirname + '/urls.log', {flags: 'a'})
	app.use(morgan('combined', {stream: accessLogStream}));
}else{
	app.use(morgan());
}


require( './config/errors' )(app);
http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express rodando na porta :  ' + app.get( 'port' ));
});
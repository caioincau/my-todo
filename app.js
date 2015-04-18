require( './config/db' );

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;


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
var favicon = require('serve-favicon');


if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  };
} else if (cluster.isWorker) {
  var app    = express();
  app.use(favicon(__dirname + '/public/favicon.ico'));

var routes = require( './routes' );

 app.get('*', function(req, res,next) {
      res.status(200);
    console.log('cluster '
      + cluster.worker.process.pid
      + ' responded \n');
    next();
});


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
app.use(compression({level: 9,memLevel: 9}));
app.use(static(path.join( __dirname, 'public'),{maxAge: 31557600000/1000}));


if(env=="production"){
	var accessLogStream = fs.createWriteStream(__dirname + '/urls.log', {flags: 'a'})
	app.use(morgan('combined', {stream: accessLogStream}));
	require( './config/errors' )(app);
}else{
	app.use(morgan('web'));
}



http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express rodando na porta :  ' + app.get( 'port' ));
});

};

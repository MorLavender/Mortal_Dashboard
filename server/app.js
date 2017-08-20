
// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var path     = require('path');
var port  	 = process.env.PORT || 3000;
if (process.env.NODE_ENV == 'production') {
    port = 80;
};

app.public = path.resolve(__dirname, '../', 'ui', 'dist')

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)

app.use(express.static(app.public));
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// routes 
require('./routes.js')(app);

app.listen(port);
console.log("App listening on port " + port);
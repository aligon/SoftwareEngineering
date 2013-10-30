var express = require('express'),
	fs = require('fs'),
	http = require('http'),
	path = require('path'),
	server, io,
	spawn = require('child_process').spawn,
	app = express();


app.configure(function(){
	app.set('port',3000);
	app.set('views', __dirname + "/views");
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('developement', function(){
	app.user(express.errorHandler());
});

app.get('*', function(req, res){
	res.render('index');
});

server = http.createServer(app).listen(app.get('port'),function(){
	console.log("Express server listening on port" + app.get('port'));
});

io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	var acl, stopFlag;

	function nextGen(){
		delete acl; //make sure we clear any listeners from the previous iterations
		if(!stopFlag){

			acl = spawn('path/to/acl2script.exe');

			acl.on('close', function(code){
				console.log('acl2 process closed with:', code);
				//TODO: read in the result file and emit it to the client
			});
		}
	}

	//init-world takes the string to write to the initial state file
	//and starts the acl2 executable to process the next generation
	socket.on('init-world', function(data){
		console.log('Setting initial state to:', data);

		//TODO: write the data to the initial-state file and call nextGen function
	});

	//Client triggers a stop
	socket.on('stop-flag', function(data){
		console.log('Stop the iterations called with:', data);
	});
});

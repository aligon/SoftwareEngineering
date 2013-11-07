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

io = require('socket.io').listen(server, {log : false});

io.sockets.on('connection', function(socket){
	var acl, stopFlag,
		filePath = './state.txt';

	console.log('new connection');
	socket.emit('handshake', {message: 'Im here'});

	function nextGen(){
		delete acl; //make sure we clear any listeners from the previous iterations
		if(!stopFlag){

			acl = spawn('./life.exe');

			acl.on('close', function(code){
				console.log('acl2 process closed with:', code);
				
				fs.readFile('./nextgen.txt', {encoding: 'utf8'}, function(err, data){
					if(err){
						console.log('There was an error reading the file:', err);
						return;
					}

					console.log('Successfully read file:', data);
					var result = {}, i, index,
						lines = data.split('\n');

					result.width = parseInt(lines[0]);
					result.height = parseInt(lines[1]);
					result.checked = {};

					for(i = 2; i < lines.length; i++){
						index = parseInt(lines[i]);
						
						if(index){
							result.checked[index + 1] = true;
						}
					}

					//next-gen transmits the next generation to the client
					socket.emit('next-gen', result);
					//nextGen();
				});
			});
		}
	}

	//init-world takes the string to write to the initial state file
	//and starts the acl2 executable to process the next generation
	socket.on('init-world', function(data){
		console.log('Setting initial state to:', data);
		stopFlag = false;
		var i, str = "";

		str += data.width + '\n';
		str += data.height + '\n';

		for( i in data.checked){
			if(data.checked.hasOwnProperty(i) && data.checked[i]){
				str += i + '\n';
			}
		}
		console.log('Starting to write to '+filePath, str);

		fs.writeFile(filePath, str, null, function(err){
			if(err){
				console.log('Error writing to '+filePath, err);
				return;
			}

			console.log('Successfully wrote to '+filePath);
			nextGen();
		});
	});

	//Client triggers a stop
	socket.on('stop-flag', function(data){
		console.log('Stop the iterations called with:', data);
		stopFlag = true;
	});
});

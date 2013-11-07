function lifeController(gridEl, width, height, size){
	var me = this,
		grid = gridEl,
		checked = {},
		cellSize = size || 15
		size = {
			width: width || 50,
			height: height || 50
		},
		socket = io.connect('http://localhost'),
		stopFlag = false, runningFlag = false;

	socket.on('handshake', function(data){
		console.log('Server handshake receiced:', data);
	});

	socket.on('next-gen', function(data){
		//debugger;
		me.clearGrid(true);
		applyState(data);
	});

	//Build a template for each cell
	function buildCellTmp(index, top, left){
		var html,
			style = "style='left: "+ left +"px; top:"+ top +"px; width: "+ (cellSize - 2) +"px; height: "+ (cellSize - 2) +"px;'";

		html = '<div class=\'cell\' '+style+' data-index=\''+index+'\'></div>';

		return html;
	}

	//adds all the cells
	function buildCells(width, height){
		var i, j, index;

		for(i = 0; i < width; i++){
			for(j = 0; j < height; j++){
				index = i * width + j;

				grid.append(buildCellTmp(index, i * cellSize, j * cellSize));
			}
		}
	}

	function buildState(){
		return {
			width: size.width,
			height: size.height,
			checked: checked
		};
	}

	function applyState(state){
		if(state.width !== size.width || state.height !== state.height){
			console.log('UHHHHHHHHHHH wat?');
		}

		var i, maxIndex = state.width * state.height;

		for(i in state.checked){
			if(state.checked.hasOwnProperty(i)){
				if(i > maxIndex){
					console.log('What are you smoking?');
				}else{
					checked[i] = true;
					$(".cell[data-index='"+i+"']").addClass('active');
				}
			}
		}
		//For testing purposes, remove before prod
		if(!stopFlag){ socket.emit('init-world', state); }
	}

	//sizes the grid accordingly and calls buildCells
	this.buildGrid = function(){
		grid.width( size.width * cellSize );
		grid.height(size.height * cellSize );

		buildCells(size.width, size.height);
	};

	this.setSize = function(width, height){
		size.width = width || size.width;
		size.height = height || size.height;
	};

	this.setCellSize = function(size){
		cellSize = size || cellSize;
	};

	this.toggleCell = function(target){
		if(runningFlag){ return; }
		if(target.hasClass('active')){
			delete checked[target.attr('data-index')];
			target.removeClass('active');
		}else{
			checked[target.attr('data-index')] = true;
			target.addClass('active');
		}
	};

	this.clearGrid = function(override){
		if(runningFlag && !(override === true)){ return; }
		$('.active').removeClass('active');
		checked = {};
	};

	this.startGen = function(){
		debugger;
		var state = buildState();
		runningFlag = true;
		stopFlag = false;
		socket.emit('init-world', state);
	};

	this.setStopFlag = function(flag){
		debugger;
		stopFlag = (!runningFlag)? false : flag;

		if(stopFlag){
			runningFlag = false;
			socket.emit('stop-flag',{});
		}
	};

}
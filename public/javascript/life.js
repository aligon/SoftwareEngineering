function lifeController(gridEl, width, height, size){
	var me = this,
		grid = gridEl,
		genGrid,
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

				genGrid.append(buildCellTmp(index, i * cellSize, j * cellSize));
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
		var me = this;

		grid.append("<div class='gen-grid'></div>");
		genGrid = $('.gen-grid');
		genGrid.width( size.width * cellSize );
		genGrid.height(size.height * cellSize );

		buildCells(size.width, size.height);

		$('.cell').bind('click', function(){
			me.selectCell($(this));
		});

		$('.cell').bind('dblclick', function(){
			me.toggleCell($(this));
		});
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

	this.selectCell = function(target){
		if(target.hasClass('selected')){
			target.removeClass('selected');
			delete this.activeCell;
		}else{
			$('.selected').removeClass('selected');
			this.activeCell = target.attr('data-index');
			target.addClass('selected');
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

	this.indexToCoor = function(n){
		var result = [];

		result[0] = Math.floor(n/size.width);
		result[1] = n - (result[0] * size.width);

		return result;
	};

	this.coorToIndex = function(i, j){
		return j + size.width*i;
	};	

	/*
		Adds a prebuilt of name with the structure of

		{
			width: 5,
			height: 3,
			cells: [
				[0,0,0,1,0],
				[0,0,0,0,0],
				[0,0,0,0,1]
			]s	
		}

	*/
	this.addPrebuilt = function(prebuilt, cls){
		if(!this.activeCell){
			alert('No Active Cell');
		}
		var topCorner = this.indexToCoor(this.activeCell), 
			i , j, cur, index;

		if(topCorner[0] + prebuilt.width > size.width){
			topCorner[0] = topCorner[0] - ((topCorner[0] + prebuilt.width) - size.width);
		}

		if(topCorner[1] + prebuilt.height > size.height){
			topCorner[1] = topCorner[1] - ((topCorner[1] + prebuilt.height) - size.height);
		}		

		for(i = 0; i < prebuilt.height; i++){
			for(j = 0; j < prebuilt.width; j++){
				index = this.coorToIndex(topCorner[0] + i, topCorner[1] + j);
				cur = $(".cell[data-index='" + index + "']")

				if(prebuilt.cells[i][j] > 0){
					checked[index] = true;
					cur.addClass(cls);
					console.log(checked);
				}
			}
		}
	};

	this.insertPrebuilt = function(prebuilt){
		debugger;
		this.addPrebuilt(prebuilt, 'active');
	};

	this.previewPrebuilt = function(prebuilt){
		this.addPrebuilt(prebuilt, 'preview');
	};

}
$(document).ready(function(){
	var checked = {},
		cellSize = 15,
		size = {
			width: 50,
			height: 50,
		};

	//Build a template for
	function buildCellTmp(index, top, left){
		var html,
			style = "style='left: "+ left +"px; top:"+ top +"px; width: "+ (cellSize - 2) +"px; height: "+ (cellSize - 2) +"px;'";

		html = '<div class=\'cell\' '+style+' data-index=\''+index+'\'></div>';

		return html;
	}

	//adds all the cells
	function buildCells(width, height, gridEl){
		var i, j, index;

		for(i = 0; i < width; i++){
			for(j = 0; j < height; j++){
				index = i * width + j;

				gridEl.append(buildCellTmp(index, i * cellSize, j * cellSize));
			}
		}
	}

	//sizes the grid accordingly and calls buildCells
	function buildGrid(width, height){
		var gridEl = $('.grid');

		gridEl.width( width * cellSize );
		gridEl.height( height * cellSize );

		buildCells(width, height, gridEl);
	}

	buildGrid(size.width, size.height);

	$('.cell').bind('click', function(){
		var target = $(this);

		if(target.hasClass('active')){
			delete checked[target.attr('data-index')];
			target.removeClass('active');
		}else{
			checked[target.attr('data-index')] = true;
			target.addClass('active');
		}

		console.log(checked);
	});


});
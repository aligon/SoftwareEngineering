$(document).ready(function(){
	var life = new lifeController($('.grid'), 100, 100),
		prebuilts = {
			'test': {
				width: 3,
				height: 3,
				cells: [
					[1,0,1],
					[0,1,0],
					[1,0,1]
				]
			}
		};

	life.buildGrid();

	
	debugger;
	$('.start').bind('click', life.startGen);

	$('.clear').bind('click', life.clearGrid);

	$('.stop').bind('click', function(){
		life.setStopFlag(true);	
	});

	$('.tabs').tabs();

	$('.handle').bind('click', function(){
		$('.controls-container').toggleClass('collapsed');
	});

	$('.prebuilt').bind('click', function(){
		var el = $(this),
			name = el.attr('data-name');

		life.insertPrebuilt(prebuilts[name]);
	});

});
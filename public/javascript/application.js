$(document).ready(function(){
	var life = new lifeController($('.grid'));

	life.buildGrid();

	$('.cell').bind('click', function(){
		life.toggleCell($(this));
	});

	$('.start').bind('click', life.startGen);

	$('.clear').bind('click', life.clearGrid);

	$('.stop').bind('click', function(){
		life.setStopFlag(true);	
	});

});
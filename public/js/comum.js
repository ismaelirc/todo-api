function tableTodoBuild(jsonTodos){
	var html = '';

	$.each(jsonTodos,function(i,el){

		var completed = ' - ';
		
		if(el.completed){
			completed = '<i class="fa fa-check"></i>';
		}

		html += '<tr><td>'+el.description+'</td><td>'+completed+'</td></tr>';
	});

	return html;
}
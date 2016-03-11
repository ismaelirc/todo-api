function tableTodoBuild(jsonTodos){
	var html = '';

	$.each(jsonTodos,function(i,el){

		var completed = ' - ';
		
		if(el.completed){
			completed = '<i class="fa fa-check"></i>';
		}

		html += "<tr class='row-todo' data-id='"+el.id+"'><td>"+el.description+"</td><td>"+el.date+"</td><td>"+completed+"</td></tr>";
		
	});

	return html;
}

$(document).ready(function() {
//Logout Button Clicked
	$("#logout").on('click',function(){

		$.ajax({
			url: "/users/login",
			type: "DELETE",
			beforeSend:function(request){
				request.setRequestHeader("Auth",localStorage.getItem('Auth'));
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {
				
					
					window.location.href = '/index.html';
					
				
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});

	});
});
$(document).ready(function() {

	//UI Components
	
    $( "#date").datepicker({
    	dateFormat: "yy-mm-dd"
    });

     $("#date").mask("9999-99-99");
  	
    //Runs everytime when this page id load. Get All todos in base
	$.ajax({
		url: "/todos",
		type: "GET",
		beforeSend:function(request){
			request.setRequestHeader("Auth",localStorage.getItem('Auth'));
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data, textStatus, request) {
			if (data) {
				var html = tableTodoBuild(data);
					
				$("#table-todos tbody").append(html);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//switch (jqXHR.status)
			console.log(jqXHR.status)
		}
	});

	//Save new todo
	$('#form-add-todo').on('submit',function(event){
		event.preventDefault();

		var desc = $.trim($('#description').val());
		var date = $.trim($('#date').val());
		var completed = false;

		if($("#completed").is(':checked')){
			completed = true;
		}

		if(!desc || !date){
			alert('Please, all fields are required.');
			$('#description').focus();
			return false;
		}

		$.ajax({
			url: "/todos",
			type: "POST",
			data: JSON.stringify({
				description: desc,
				completed: completed,
				date: date
			}),
			beforeSend:function(request){
				request.setRequestHeader("Auth",localStorage.getItem('Auth'));
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {
				if (data) {
					$('#description').val('');
					$('#date').val('');

					var jsonResult = [data];
					var html = tableTodoBuild(jsonResult);
					
					$("#table-todos tbody").append(html);
					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});
	});

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
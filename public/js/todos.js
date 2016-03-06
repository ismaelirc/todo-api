$(document).ready(function() {

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

	$('#form-add-todo').on('submit',function(event){
		event.preventDefault();

		var desc = $('#description').val();
		var completed = false;

		if($("#completed").is(':checked')){
			completed = true;
		}

		$.ajax({
			url: "/todos",
			type: "POST",
			data: JSON.stringify({
				description: desc,
				completed: completed,
				date: '2016-12-31'
			}),
			beforeSend:function(request){
				request.setRequestHeader("Auth",localStorage.getItem('Auth'));
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {
				if (data) {
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
});
$(document).ready(function() {

//Runs everytime when this page id load. Get info from user
	$.ajax({
		url: "/users/user",
		type: "GET",
		beforeSend:function(request){
			request.setRequestHeader("Auth",localStorage.getItem('Auth'));
		},
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data, textStatus, request) {
			$("#email").val(data.email);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			//switch (jqXHR.status)
			console.log(jqXHR.status)
		}
	});

	//Update user
	$('#form-update-user').on('submit',function(event){
		event.preventDefault();

		var password = $.trim($('#password').val());

		if(password.lenght < 6){
			alert('Please, password should be more than 6 characters.');
			$('#password').focus();
			return false;
		}

		$.ajax({
			url: "/users",
			type: "PUT",
			data: JSON.stringify({
				password: password
			}),
			beforeSend:function(request){
				request.setRequestHeader("Auth",localStorage.getItem('Auth'));
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {
				
				if(data){
					alert('Password changed successfully.');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});
	});
});
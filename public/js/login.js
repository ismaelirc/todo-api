$(document).ready(function() {

	/*
	 Realiza o login na aplicação
	 * */
	$("#entrar").on('click', function() {

		var email = $.trim($('#inputEmail').val());
		var senha = $.trim($('#inputPassword').val());

		var data = {
			'password': senha,
			'email': email
		};

		$.ajax({
			url: "/users/login",
			type: "POST",
			data: JSON.stringify({
				email: email,
				password: senha
			}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {
				if (data) {
					
					localStorage.setItem('Auth', request.getResponseHeader('Auth'));
					
					window.location.href = '/todos.html';

				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});
	});
});
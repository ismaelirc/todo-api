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
		var method = "POST";
		var url = "/todos"

		if($("#completed").is(':checked')){
			completed = true;
		}

		if(!desc || !date){
			alert('Please, all fields are required.');
			$('#description').focus();
			return false;
		}

		if($.trim($("#todo-id-update").val()) != ''){
			method = "PUT";
			url = "/todos/"+$("#todo-id-update").val();
		}

		$.ajax({
			url: url,
			type: method,
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
					$('#completed').prop('checked', false);

					if($.trim($("#todo-id-update").val()) != ''){

						$("[data-id="+$("#todo-id-update").val()+"]").find("td").eq(0).html(data.description);
						$("[data-id="+$("#todo-id-update").val()+"]").find("td").eq(1).html(data.date);

						if(data.completed == true){
							$("[data-id="+$("#todo-id-update").val()+"]").find("td").eq(2).html('<i class="fa fa-check"></i>');
						}
						
						$('.cancel-update').hide();

					}else{
						
						var jsonResult = [data];
						var html = tableTodoBuild(jsonResult);
					
						$("#table-todos tbody").append(html);	
					}

					
					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});
	});


	//Click in table Todo row
	$(document).on('click','.row-todo',function(){
		var idTodo = $(this).data('id');
		var url = '/todos/'+idTodo;

		$.ajax({
			url: url,
			type: "GET",
			beforeSend:function(request){
				request.setRequestHeader("Auth",localStorage.getItem('Auth'));
			},
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data, textStatus, request) {

				if(data){
					$("#description").val(data.description);
					$("#date").val(data.date);
					$("#todo-id-update").val(data.id);
					$('.cancel-update').show();

					if(data.completed == true){
						
						$('#completed').prop('checked', true);
						
					}else{

						$('#completed').prop('checked', false);
					
					}
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				//switch (jqXHR.status)
				console.log(jqXHR.status)
			}
		});


	});

	$('.cancel-update').on('click',function(){

		$("#description").val('');
		$("#date").val('');
		$("#todo-id-update").val('');
		$('#completed').prop('checked', false);
		$('.cancel-update').hide();

	});

});
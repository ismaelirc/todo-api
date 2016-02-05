var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/',function(req, res){
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos',function(req,res){
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id',function(req, res){
	
	var todoId = parseInt(req.params.id, 10);

	var todoObj = _.findWhere(todos,{id: todoId})

	// THE LINE ABOVE REPLICE THIS CODE

	// todos.forEach(function(item){
	// 	if(item.id === id){
	// 		todoObj = item;
	// 	}
	// })

	if(todoObj){
		res.json(todoObj);	
	}
	
	res.status(404).send();

});

//POST /todos
app.post('/todos',function(req, res){
	var body = req.body;

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){

		return res.status(400).send();

	}

	todo = _.pick(body,"description","completed");
	todo.description = todo.description.trim();

	todo.id = todoNextId;

	todos.push(todo);

	todoNextId++;			

	res.json(body);
});

app.delete('/todos/:id',function(req, res){

	var todoId = parseInt(req.params.id, 10);
	
	var todoObj = _.findWhere(todos,{id: todoId});

	if(!todoObj){
		res.status(404).json({"error":"Object not found!"});
	}

	todos = _.without(todos,todoObj);

	res.status(200).send();

});

app.put('/todos/:id',function(req,res){
	var todoId = parseInt(req.params.id, 10);
	var todoObj = _.findWhere(todos,{id: todoId});

	if(!todoObj){
		res.status(404).send();
	}

	var body = req.body; 
	todo = _.pick(body,"description","completed");
	validAttributes = {};


	if(todo.hasOwnProperty('completed') && _.isBoolean(todo.completed)){
		validAttributes.completed =  todo.completed;

	}else if(todo.hasOwnProperty('completed')){
		return res.status(404).send();
	
	}

	if(todo.hasOwnProperty('description') && _.isString(todo.description) && todo.description.trim().length > 0){
		validAttributes.description = todo.description;
	
	}else if(todo.hasOwnProperty('description')){

		return res.status(404).send();
	}
	
	//READY TO UPDATE!
	_.extend(todoObj,validAttributes);

	res.status(200).send();

});

app.listen(PORT,function(){
	console.log('Express listening on port '+ PORT);
});
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
//var todos = [];
//var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {

		filteredTodos = _.where(filteredTodos, {
			completed: true
		});

	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {

		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}


	if (queryParams.hasOwnProperty('q') && queryParams.q.trim().length > 0) {

		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		})

	}


	res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	
	var matchedTodo = db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());	
		}else{
			res.status(404).send();	
		}
		

	},function(e){
		res.status(500).send();
	});


});

//POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {

		res.json(todo.toJSON());

	}, function(e) {
		res.status(400).json(e);
	});

});

app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	var todoObj = _.findWhere(todos, {
		id: todoId
	});

	if (!todoObj) {
		res.status(404).json({
			"error": "Object not found!"
		});
	}

	todos = _.without(todos, todoObj);

	res.status(200).send();

});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var todoObj = _.findWhere(todos, {
		id: todoId
	});

	if (!todoObj) {
		res.status(404).send();
	}

	var body = req.body;
	todo = _.pick(body, "description", "completed");
	validAttributes = {};


	if (todo.hasOwnProperty('completed') && _.isBoolean(todo.completed)) {
		validAttributes.completed = todo.completed;

	} else if (todo.hasOwnProperty('completed')) {
		return res.status(404).send();

	}

	if (todo.hasOwnProperty('description') && _.isString(todo.description) && todo.description.trim().length > 0) {
		validAttributes.description = todo.description;

	} else if (todo.hasOwnProperty('description')) {

		return res.status(404).send();
	}

	//READY TO UPDATE!
	_.extend(todoObj, validAttributes);

	res.status(200).send();

});

db.sequelize.sync({
	// force:true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT);
	});
});
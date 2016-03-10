var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcryptjs = require('bcryptjs');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET GET All Todos
app.get('/todos',middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {

		where.completed = true;

	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {

		where.completed = false;

	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {

		where.description = {
			$like: '%' + query.q + '%'
		};
	}


	var filteredTodos = db.todo.findAll({
		where: where
	}).then(function(todos) {

		res.json(todos);

	}, function(e) {
		console.log(e);
		res.status(500).send();
	})


});

//GET One Todo
app.get('/todos/:id',middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10);


	var matchedTodo = db.todo.findOne({
		where:{
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}


	}, function(e) {
		res.status(500).send();
	});


});

//POST Create a Todo
app.post('/todos',middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed','date');

	db.todo.create(body).then(function(todo) {

		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function(){
			res.json(todo.toJSON());
		});

	}, function(e) {
		res.status(400).json(e);
	});

});

//DELETE one Todo
app.delete('/todos/:id',middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {

		if (rowsDeleted === 0) {
			res.status(404).json({
				"error": "Object not found!"
			});
		} else {
			res.status(204).send();
		}


	}, function(e) {

		res.status(404).send();

	})

});

//PUT Update one todo
app.put('/todos/:id',middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = req.body;
	todo = _.pick(body, "description", "completed","date");
	attributes = {};

	if(todo.hasOwnProperty('date')){
		attributes.date = todo.date;
	}

	if (todo.hasOwnProperty('completed')) {
		attributes.completed = todo.completed;

	}

	if (todo.hasOwnProperty('description')) {
		attributes.description = todo.description;

	}

	//READY TO UPDATE!
	db.todo.findOne({
		where:{
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function(todo) {
		if (todo) {

			todo.update(attributes).then(function(todo) {

				res.json(todo.toJSON());

			}, function(e) {

				res.status(400).json(e);
			});

		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();

	});

});

//POST Create New Users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {

		res.json(user.toPublicJSON());

	}, function(e) {
		res.status(400).json(e);
	});
});

//POST LOGIN
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('autentication');
		userInstance = user;

		return db.token.create({
			token: token
		})

	}).then(function(tokenInstance){
		
		res.header('Auth',tokenInstance.get('token')).json(userInstance.toPublicJSON());

	}).catch(function(e){
		res.status(401).send();

	});
});

//GET INFO USER
app.get('/users/user',middleware.requireAuthentication ,function(req, res) {
	var query = req.query;
	var where = {
		id: req.user.get('id')
	};

	db.user.findOne({
		where: where
	}).then(function(user) {
		
		res.json(user.toPublicJSON());

	}, function(e) {

		res.status(404).send();

	});

});

//PUT Update Users
app.put('/users',middleware.requireAuthentication, function(req, res) {
	var body = req.body;
	userUpdate = _.pick(body, "password");
	var where = {
		id: req.user.get('id')
	};

	attributes = {};

	if(userUpdate.hasOwnProperty('password')){
		attributes.password = userUpdate.password;
	}

	//READY TO UPDATE!
	db.user.findOne({
		where:where
	}).then(function(user) {
		if (user) {

			user.update(attributes).then(function(user) {

				res.json(user.toJSON());

			}, function(e) {

				res.status(400).json(e);
			});

		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();

	});

});

//Logout
app.delete('/users/login',middleware.requireAuthentication, function(req, res){
	
	req.token.destroy().then(function(){
		res.status(204).send();

	}).catch(function(){

		res.status(500).send();
	});

});

db.sequelize.sync({
	//force:true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT);
	});
});
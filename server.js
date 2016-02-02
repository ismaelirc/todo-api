var express = require('express');
var bodyParser = require('body-parser');

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
	var id = parseInt(req.params.id, 10);
	var todoObj;

	todos.forEach(function(item){
		if(item.id === id){
			todoObj = item;
		}
	})

	if(todoObj){
		res.json(todoObj);	
	}
	
	res.status(404).send();

});

//POST /todos
app.post('/todos',function(req, res){
	var body = req.body;

	var todo = {
					id: parseInt(todoNextId,10),
					description: body.description,
					completed: false
				};

	todos.push(todo);
	todoNextId++;			


	res.json(body);
});

app.listen(PORT,function(){
	console.log('Express listening on port '+ PORT);
});
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todos', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

sequelize.sync(/*{force: true}*/).then(function() {

	console.log('Everything is synced');

	Todo.findById(2).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}else{
			console.log('Not Found');
		}
	})



	// Todo.create({
	// 	description: "Take out trash"
		
	// }).then(function(todo) {

	// 	return Todo.create({
	// 		description: 'Clean ap'
	// 	});
	
	// }).then(function(){
	// 	return Todo.findAll({
	// 		where:{
	// 			completed: false
	// 		}
	// 	});

	// }).then(function(todos){
		
	// 	if(todos){
	// 		todos.forEach(function(todo){
	// 			console.log(todo.toJSON());
	// 		});
	// 	}
	// }).catch(function(e){

	// 	console.log(e);

	// });

});
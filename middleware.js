module.exports = function(db){
	return {
		requireAuthentication: function (req, res, next){
			var token = req.get('Auth');

			db.user.findByToken(token).then(function(user){

				if(user){

					req.user = user;
					next();

				}else{
					res.status(401).send();	
				}

			},function(e){
				console.log(e);
				res.status(401).send();
			});
		}
	};
}
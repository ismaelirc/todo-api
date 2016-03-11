var moment = require('moment');

module.exports = function(sequelize, DataTypes){
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				len: [1, 250]
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		date:{
			type: DataTypes.DATE,
			allowNull: false,
			validate:{
				isDate:true
			},get: function() {

				var newDate = moment(this.getDataValue('date')).format('YYYY-MM-DD');

				return newDate;
			}
		}
	});
};
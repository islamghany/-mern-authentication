const mongoose = require('mongoose');

const Schema = mongoose.Schema
const userSchema = Schema({
	email:{
		type:String,
		require:true,
		unique:true
	},
	name:{
		type:String,
		required:true,
		minlength:6
	},
	password:{
		type:String,
		required:true,
		minlength:6
	},
	resetToken: String,
  resetTokenExpiration: Date,

});

module.exports = mongoose.model('User',userSchema);


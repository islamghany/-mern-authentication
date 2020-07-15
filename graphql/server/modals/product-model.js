const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	name:{
		type:String,
		required:true,
		trim:true,
		maxLength:32
	},
	description:{
		type:String,
		required:true,
		maxLength:2000
	},
	price:{
		type:Number,
		trim:true,
		required:true,
		maxLength:32
	},
	category:{
		type:mongoose.Types.ObjectId,
		ref: "Category",
        required: true
	},
	quantity: {
            type: Number
        },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: Boolean
    }
},{ timestamps: true });

module.exports = mongoose.model("Product", productSchema);

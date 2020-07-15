const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema =new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        },
        resetPasswordLink:{
            type:String,
            default:''
        }
    },
    { timestamps: true }
);


// virtual
userSchema.virtual('password')
.set(function(password){
    this._password = password;
    this.salt=this.makeSalt();
    this.hashedPassword = this.encriptPassword(password);
})
.get(function(){
    return this._password
})

userSchema.methods={
    authenticate:function(plainText){   
        return this.encriptPassword(plainText) === this.hashedPassword;
    },
    encriptPassword:function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt).update(password).digest('hex')
        }catch(err){return '';}
    },
    makeSalt:function(){
        return Math.random(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = mongoose.model('User', userSchema);


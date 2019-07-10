const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken")

const userShema = new mongoose.Schema({
    user: {
         type: String,
         unique: true,
         required: true,
         trim: true,
         lowercase: true
     },
     password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    rol:{
        type: String,
        required: true,

    },
    tokens:[{
        token: {
            type: String,
            required: true,

        },

    }]
}, { versionKey: false })  


userShema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()},"lamodaesteneruntokenentusession")
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
} 


userShema.statics.findByCredentials = async(user, password) =>{
    const users = await User.findOne(({user}));
    if(!users){
        throw new Error("Unable to Login");
    }
    const isMatch  = await bcrypt.compare(password, users.password);
    if(!isMatch){
        throw new Error("Unable to Login");
    }
    return users
}

userShema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();

});

// const token = mongoose.Scha

const User = mongoose.model("users", userShema );

module.exports = User
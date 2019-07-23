const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }] 
}, {
    timestamps: true
});

UserSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
});

UserSchema.methods.generateAuthToken = async function(){

    const user = this;
    const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});

    await user.save();

    return token;
}

UserSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });

    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Wrong Password');
    }

    return user;
}

UserSchema.methods.toJSON = function(){

    const user = this;
    const userObject = user.toObject();

    delete user.password;
    delete user.tokens;

    return userObject;
}

UserSchema.virtual('foods', {
    ref: 'Food',
    localField: '_id',
    foreignField: 'owner'
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
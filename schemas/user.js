const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    githubid: {
        type: String,
    }
})
UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema)
module.exports = User;
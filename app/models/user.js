// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    openid: {type: String, required: '`openid` is required'},
    createAt: {type: Date, required: '`createdAt is required`'},
    conversationCount: {type: Number, default: 0},
});


mongoose.model('User', UserSchema);


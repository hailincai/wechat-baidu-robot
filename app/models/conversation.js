// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User', required: '`user` is required'},
    question: {type: String, required: '`question` is required'},
    answer: {type: String, default: ''},
    createdAt: {type: Date, required: '`createAt` is required'},
});


mongoose.model('Conversation', ConversationSchema);


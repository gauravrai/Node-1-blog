const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const CommentsSchema = new Schema({
    body: {
        type :String,
        required: true
    },
    user: {
        type:   Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
    commentIsApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('comment', CommentsSchema);
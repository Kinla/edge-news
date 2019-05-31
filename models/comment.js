const mongoose = require("mongoose")

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: "Anonymous"
    },
    body: {
        type: String,
        trim: true,
        required: true
    }

})

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment
const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        trim: true,
        required: true
    },
    imgSrc: {
        type: String,
        trim: true,
    },
    imgSet: {
        type: String,
        trim: true,
    },
    blurb: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }

})

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article
const express = require("express")
const router = express.Router();
const db = require("../models")

router.get("/", (req, res) => {
    db.Article.find({})
    .then((data) => {
        let articles = {articles: data}
        res.render("index", articles)
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = router
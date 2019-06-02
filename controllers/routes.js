const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const cheerio = require("cheerio")

const findAndShowAllArticles = (res) =>{
    db.Article.find({})
    .then(articles => {
        const articlesObj = {}
        articlesObj.articles = articles
        const categoryArr = []
        articles.forEach(el => {
            const category = el.category
            if (categoryArr.indexOf(category) === -1){
                categoryArr.push(category)
            }
        });
        articlesObj.categories = []
        categoryArr.forEach(element => {
            articlesObj.categories.push({name: element})
        });
        res.render("index", articlesObj)
    })
    .catch(err => console.log(err))
}

router.get("/", (req, res) => {
    return axios.get("https://science.howstuffworks.com/innovation")
    .then((response) =>{
        const $ = cheerio.load(response.data)
        let divs = $(".module #landing-content.articles div.media").nextAll()
        let count = divs.length -2
        $(".module #landing-content.articles div.media")
        .each(function (i, element){
            const result = {}

            result.title = $(this)
                .children(".media-body")
                .find("h5")
                .text()

            result.link = $(this)
                .find("a")
                .attr("href")

            result.imgSet = $(this)
                .find("img") 
                .attr("data-srcset")

            result.imgSrc = $(this)
                .find("img")
                .attr("src") 

            result.blurb = $(this)
                .children(".media-body")
                .find("p")
                .text()

            result.category = $(this)
                .children(".media-body")
                .find("span:last-child")
                .text()
                .split(" / ")[1]

            db.Article.updateOne({title: result.title}, {$set: result}, {upsert: true})
            .then((data) => {
                if (i === count){
                    findAndShowAllArticles(res)
                }
            })
            .catch(err => console.log(err))
        })
    })
})

router.get("/saved", (req, res) => {
    db.Article.find({saved: true})
    .then((data) => {
        let saved = {articles: data}
        saved.header = "Bookmarks"
        saved.bookmark = true
        res.render("lists", saved)
    })
    .catch(err => console.log(err))
})

router.get("/articles/:id", (req, res) =>{
    let id = req.params.id
    db.Article.findById(id)
    .populate("comment")
    .then((article) =>{
        let articleObj = article
        articleObj.bookmark = false
        res.render("article", articleObj)
    })
    .catch(err => console.log(err))
})

router.post("/articles/:id", (req, res) =>{
    let id = req.params.id
    let comment = req.body
    
    db.Comment.create(comment)
    .then((newComment) =>{
        return db.Article.findByIdAndUpdate(id, { $push: { comment: newComment._id } }, { new: true });
    })
    .then((article) =>{
        res.send({
            redirect: "/articles/" + id
        })        
    })
    .catch(err => console.log(err))
})

router.post("/saved/:id", (req, res)=>{
    let id = req.params.id
    db.Article.updateOne({_id: id}, {$set: {saved: true}})
    .then(data => {
        res.send("sucess")        
    })
    .catch(err => console.log(err))
})

router.post("/unsave/:id", (req, res)=>{
    let id = req.params.id
    db.Article.updateOne({_id: id}, {$set: {saved: false}})
    .then(data => {
        res.send({
            redirect: "/saved"
        })        
    })
    .catch(err => console.log(err))
})

//Individual category
router.get("/category/:type", (req, res)=>{
    let type = req.params.type
    db.Article.find({category: type})
    .then(article =>{
        const articlesObj = {articles: article}
        articlesObj.header = type
        articlesObj.bookmark = false
        res.render("lists", articlesObj)
    })
    .catch(err => console.log(err))
})




module.exports = router
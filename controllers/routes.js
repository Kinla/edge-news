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
        articlesObj.categories = [{name: "All Articles"}]
        categoryArr.forEach(element => {
            articlesObj.categories.push({name: element})
        });
        console.log(articlesObj)
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
        console.log(count)
        $(".module #landing-content.articles div.media")
        .each(function (i, element){
            console.log(i)
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
                console.log(data)
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
        let saved = data
        res.render("saved", saved)
    })
    .catch(err => console.log(err))
})

router.get("/articles/:id", (req, res) =>{
    let id = req.params.id
    db.Articles.findbyId(id)
    .populate("note")
    .then((article) =>{
        let articleObj = {article: article}
        res.render("article", articleObj)
    })
    .catch(err => console.log(err))
})


module.exports = router
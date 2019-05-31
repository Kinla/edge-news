const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const cheerio = require("cheerio")

const findAndShowAllArticles = (res) =>{
    db.Article.find({})
    .then(articles => {
        const articlesObj = {}
        articlesObj.artciles = articles
        articlesObj.categories = []
        articles.forEach(el => {
            const category = el.category
            if (articlesObj.categories.indexOf(category) === -1){
                articlesObj.categories.push(category)
            }
        });
        console.log(articlesObj)
        res.render("index", articlesObj)
    })
    .catch(err => console.log(err))
}

// router.get("/", async(req, res) => {
//     await scrapeAndUpdate()
//     await findAllArticles(res)
// })

// router.get("/", (req, res) => {
//     return axios.get("https://science.howstuffworks.com/innovation")
//     .then((response) =>{
//         const $ = cheerio.load(response.data)
//         return Promise.all([response, $(".module #landing-content.articles div.media").each(function (i, element){
//             const result = {}

//             result.title = $(this)
//                 .children(".media-body")
//                 .find("h5")
//                 .text()

//             result.link = $(this)
//                 .find("a")
//                 .attr("href")

//             result.imgSet = $(this)
//                 .find("img") 
//                 .attr("data-srcset")

//             result.imgSrc = $(this)
//                 .find("img")
//                 .attr("src") 

//             result.blurb = $(this)
//                 .children(".media-body")
//                 .find("p")
//                 .text()

//             result.category = $(this)
//                 .children(".media-body")
//                 .find("span:last-child")
//                 .text()
//                 .split(" / ")[1]

//             db.Article.updateOne({title: result.title}, {$set: result}, {upsert: true})
//             .then((data) => {
//                 console.log(data)
//             })
//             .catch(err => console.log(err))
//         })])
//     .then(()=>{
//         findAllArticles(res)
//     })    
//     })
// })


router.get("/", (req, res) => {
    axios.get("https://science.howstuffworks.com/innovation")
    .then((response) =>{
        const $ = cheerio.load(response.data)
        $(".module #landing-content.articles div.media").each(function (i, element){
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
            })
            .catch(err => console.log(err))
        })
        findAndShowAllArticles(res)
    })
})

router.get("/saved", (req, res) => {
    db.Article.find({saved: true})
    .then((data) => {
        let saved = {saved: data}
        res.render("saved", saved)
    })
    .catch(err => console.log(err))
})


module.exports = router
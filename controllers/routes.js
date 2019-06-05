const express = require("express")
const router = express.Router()
const db = require("../models")
const axios = require("axios")
const cheerio = require("cheerio")

router.get("/", async (req, res) => {
    let categories = await db.Category.find({})
    let docNum = await db.Article.countDocuments()
    let pageCount = Math.ceil(docNum / 12)
    let pageNum = req.query.p || 1

    db.Article.find({}).skip(12*(pageNum-1)).limit(12)
    .then(articles => {
        const articlesObj = {} 
        articlesObj.articles = articles
        articlesObj.categories = categories
        articlesObj.pagination = {
            page: pageNum,       // The current page the user is on
            pageCount: pageCount  // The total number of available pages
          }
        
        articlesObj.partials = ["featureNews", "singleNews"]//doesn't see the desired change (ie only upating these partials instead of rerender whole page with thise options)
        
        articlesObj.more = true  
        if(pageCount < 2){
            articlesObj.more = false
        }  
        
        if (!pageNum || pageNum < 2  ){
            articlesObj.layout = "home"
            return res.render("index", articlesObj)
        } else {
            articlesObj.layout = "main"
            return res.render("lists", articlesObj)

        }
    })
    .catch(err => console.log(err))
})

router.get("/saved", async(req, res) => {
    let docNum = await db.Article.find({saved: true}).countDocuments()
    let pageCount = Math.ceil(docNum / 10)
    let pageNum = req.query.p || 1

    db.Article.find({saved: true}).skip(10*(pageNum-1)).limit(10)
    .then((data) => {
        let saved = {articles: data}
        saved.header = "Bookmarks"
        saved.bookmark = true
        saved.partials = ["singleNews"]
        saved.pagination = {
            page: pageNum,       // The current page the user is on
            pageCount: pageCount  // The total number of available pages
          }
        saved.more = true  
        if(pageCount < 2){
            saved.more = false
        }  
        
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
        articleObj.count = article.comment.length
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
        res.send("Commet posted")
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
router.get("/category/:type", async(req, res)=>{
    let type = req.params.type
    let docNum = await db.Article.countDocuments({category: type})
    let pageCount = Math.ceil(docNum / 10)
    let pageNum = req.query.p || 1

    db.Article.find({category: type}).skip(10*(pageNum-1)).limit(10)
    .then(article =>{
        const articlesObj = {articles: article}
        articlesObj.header = type
        articlesObj.bookmark = false
        articlesObj.pagination = {
            page: pageNum,       // The current page the user is on
            pageCount: pageCount  // The total number of available pages
          }
        articlesObj.more = true  
        if(pageCount < 2){
            articlesObj.more = false
        }  
        res.render("lists", articlesObj)
    })
    .catch(err => console.log(err))
})

//Admin utility pages
router.get("/admin", (req, res)=>{
    res.render("admin")
})

router.get("/scrape", (req, res) =>{
    axios.get("https://science.howstuffworks.com/innovation")
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

            let category = $(this)
            .children(".media-body")
            .find("span:last-child")
            .text()
            .split(" / ")[1]
                
            const newCategory = {name: category} 
            
            db.Article.updateOne({title: result.title}, {$set: result}, {upsert: true})
            .then((data) => {
                return db.Category.updateOne(newCategory, {$set: newCategory}, {upsert: true})
            })
            .then((cat) => {
                if (i === count){
                    res.send("Finished scraping.")
                }
            })
            .catch(err => console.log(err))
        })
    })

})

router.get("/clearDB", async (req, res) =>{
    let article = await db.Article.deleteMany()
    let comment = await db.Comment.deleteMany()
    res.json({articles: article, comments: comment})
})

router.post("/removeDoc", (req, res) => {
    let collection = req.body.collection
    let id = req.body.id

    if (collection === "article") {
        removeArticlebyId(id, res)

    }else if (collection === "comment") {
        removeCommentbyId(id, res)
    }
})

const removeCommentbyId = (id, res) =>{
    db.Comment.findByIdAndRemove(id)
    .then(comment =>{
        return db.Article.updateOne({comment: id}, {$pull: {comment: id}}, {new: true})
    })
    .then((article)=>{
        res.send(`Removed entry ${id} from comment and article collections.`)
    })
    .catch(err => console.log(err))

}

const removeArticlebyId = (id, res) =>{
    db.Article.findByIdAndRemove(id)
    .then(article =>{
        let commentId = article.comment
        
        commentId.forEach(element => {
            db.Comment.deleteOne({_id: element})
            .then(()=>{})
            .catch(err => console.log(err))
        });

        res.send("Done removing all traces of this article.")
    })
}

module.exports = router
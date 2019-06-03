//Require all npms
const express = require("express")
const mongoose = require("mongoose")

//Set up mongoose
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/headlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Set up Express
let PORT = process.env.PORT || 3000
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Set up handlebars
const exphbs = require("express-handlebars");
const hbsHelper = require("./controllers/hbsHelper")
app.engine("handlebars", exphbs({ 
    defaultLayout: "main", 
    helpers: hbsHelper,
    layoutsDir: __dirname + "/views/layouts/",
    partiasDir: __dirname + "/views/partials/" 
}));
app.set("view engine", "handlebars");

// //Routes
const routes = require("./controllers/routes.js")
app.use(routes)

//Listen to port
app.listen(PORT, () => {
    console.log(`connected on port ${PORT}`)
})
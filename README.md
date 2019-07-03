# Sci Edge

## Overview

Sci Edge is a web app that lets users view and leave comments on the latest innovation news scraped from [How Stuff Works](https://science.howstuffworks.com/innovation). The scraping is done with Mongoose and Cheerio. The rendering is done via express-handlebars.

There is another set of admin utilities as well.

### Technologies

* HTML5
* CSS3 / Bootstrap / Material Design for Bootstrap
* LazySizes
* Javascript / jQuery
* Axios
* Cheerio
* Express
* Express-handlebars
* handlebars-paginate
* MongoDB / Mongoose

## Demo
Shows user interactivity only.
[![demo](https://github.com/Kinla/edgeNews/blob/master/sciedge.PNG)](https://youtu.be/ANn6W7DEa10)


## Pages and Functionalities
This app contains the following pages:

### Home

Displays all categories. Displays all articles from the application database. Each article includes the folowing information:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Image - low res image and the image set

     * Category - the category of the article


### Category

Displays articles from a specifc category.


### Bookmark

Displays all bookmarked articles.


### Article

Displays inforation of the article including comments. Visiters can leave their comments here.


### Admin

The admin functionalities can be accessed through the cog/gear icon at the footer. The functionalities include:
    * Scrpae - scrape for new articles from How Stuff Works
    * ClearDB - delete all documents for each model
    * Removal form - dete a specific entry and all its relatinal records within the database
    

### Working Components
* Nab bar
* Bookmark
* Catgory buttons + links within article blocks
* Pagination

## License
MIT

const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scarperData";

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
        if(err) throw err;
        console.log("Database Connected!");
    });


app.use(express.static("public"));

app.get("/", (req, res) => {
    db.Article
        .find({})
        .populate("comments")
        .then(dbArticles => {
            // res.json(dbArticles);
            res.render("home", {articles: dbArticles});
        });
});

app.get("/scrape", (req, res) => {
    // Make a request via axios to grab the HTML body from the site of your choice
    axios.get("https://cnnespanol.cnn.com/").then(response => {
  

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            const $ = cheerio.load(response.data);
          
            // An empty array to save the data that we'll scrape
            const results = [];
          
            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("div.news__data").each(function(i, element) {
          
              // Save the text of the element in a "title" variable
              let title = $(element).find("h2.news__title").find("a").text();
          
              // In the currently selected element, look at its child elements (i.e., its a-tags),
              // then save the values for any "href" attributes that the child elements may have
              let link = $(element).find("h2.news__title").find("a").attr("href");
              let description = $(element).find("div.news__excerpt").find("p").text();
              let postObj = {
                  title: title,
                  link: link,
                  description: description
              };
              // Save these results in an object that we'll push into the results array we defined earlier
              results.push({
                title: title,
                link: link,
                description: description
              });
            });
          
            // Log the results once you've looped through each of the elements found with cheerio
            console.log(results);
          });
          });
        // Log the results once you've looped through each of the elements found with cheerio
    

app.post("/api/:articleId/comment", (req, res) => {
    db.Comment
        .create({body: req.body.body})
        .then(dbComment => {
            return db.Article.findOneAndUpdate({_id: req.params.articleId}, {$push: { comments: dbComment._id}}, {new: true})
        })
        .then(() => res.redirect("/"))
        .catch(err => res.json(err));
});

app.listen(PORT, () => console.log(`App is on http://localhost:${PORT}`));
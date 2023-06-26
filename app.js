//jshint esversion:6
require('dotenv').config({ path: '.env' })
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function(req, res) {
        Article.find().then((articles) => {
            //res.render("articles", {articles: articles});
            res.json(articles);
        }).catch((err) => {
            res.send(err);
        });
    })
    .post(function(req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save().then(() => {
            //res.redirect("/articles");
            res.send("Article saved");
        }).catch((err) => { 
            res.send(err);
        });
    })
    .delete(function(req, res) {
        Article.deleteMany().then(() => {
            res.send("All articles deleted");
            //res.redirect("/articles");
        }).catch((err) => { 
            res.send(err);
        });
    });

app.route("/articles/:title")
    .get(function(req, res) {
        Article.findOne({title: req.params.title}).then((article) => {
            //res.render("article", {article: article});
            res.json(article);
        }).catch((err) => { 
            res.send(err);
        });
    })   
    .patch(function(req, res) {
        Article.updateOne({title: req.params.title}, {$set: req.body}).then(() => {
            //res.redirect("/articles/" + req.params.title);
            res.send("Article updated");
        }).catch((err) => { 
            res.send(err);
        });
    })    
    .put(function(req, res) {
        Article.updateOne({title: req.params.title}, {$set: req.body}, {overwrite: true}).then(() => {
            //res.redirect("/articles" + req.params.title);
            res.send("Article updated");
        }).catch((err) => { 
            res.send(err);
        });
    })
    .delete(function(req, res) {
        Article.deleteOne({title: req.params.title}).then(() => {
            //res.redirect("/articles" + req.params.title);
            res.send("Article deleted");
        }).catch((err) => { 
            res.send(err);
        });
    });


connectDB().then(() => {
    app.listen(PORT, function() {
      console.log("listening to requests");
    });
  }).catch((err) => { 
    res.send(err);
});
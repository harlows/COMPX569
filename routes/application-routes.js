const express = require("express");
const router = express.Router();

const middleware = require("../middleware/auth.js");
const articlesDao = require("../modules/articles-dao.js");
const {createArticle} = require("../modules/articles-dao");

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", middleware.verifyAuthenticated, async function(req, res) {
    
    const articles = await articlesDao.getArticles();
    console.log(articles);
    
    res.render("home", {
        user: req.session.user,
        articles: articles
    });
});

router.post("/articles", async function (req, res) {

    // Get the data from the database

    // Create new article
    const newArticle = await articlesDao.createArticle(article);
    res.redirect("/");
});

module.exports = router;
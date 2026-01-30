const express = require("express");
const router = express.Router();

const middleware = require("../middleware/auth.js");
const articlesDao = require("../modules/articles-dao.js");
const {createArticle} = require("../modules/articles-dao");

// Whenever we navigate to /, display all articles and check if we're authenticated.
router.get("/", async function(req, res) {
    
    const allArticles = await articlesDao.getArticles();
    let myArticles = [];
    const user = req.session.user || null; // you're either logged in or not

    if (user) {
        myArticles = await articlesDao.getArticlesByAuthor(user.id);
    }
    res.render("home", {
        user,
        allArticles,
        myArticles
    });
});

router.get("/articles/new", middleware.verifyAuthenticated, function (req, res) {
    res.render("articles/new");
});

router.post("/articles", async function (req, res) {

    // Get the data from the database

    // Create new article
    const newArticle = await articlesDao.createArticle(article);
    res.redirect("/");
});

module.exports = router;
const express = require("express");
const router = express.Router();

const middleware = require("../middleware/auth.js");
const articlesDao = require("../modules/articles-dao.js");

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

// Route to request articles in the sort order passed by URL and respond with json
router.get("/articles/", async function (req, res) {
    const { sort } = req.query;
    const articles = await articlesDao.getArticles(sort);
    res.json(articles);
});

router.post("/articles", middleware.verifyAuthenticated, async function (req, res) {
    
    // Get user
    const author_id = req.session.user.id;
    
    // Get form data
    const { title, content } = req.body;

    const article = { author_id, title, content };
    
    // Create new article
    const newArticle = await articlesDao.createArticle(article);
    res.redirect("/");
});

router.get("/articles/new", middleware.verifyAuthenticated, function (req, res) {
    res.render("articles/new");
});

module.exports = router;
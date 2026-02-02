const express = require("express");
const router = express.Router();
const fs = require("fs");

const middleware = require("../middleware/auth.js");
const upload = require("../middleware/upload");
const articlesDao = require("../modules/articles-dao.js");

// Whenever we navigate to /, display all articles and check if we're authenticated.
router.get("/", async function(req, res) {
    const message = req.session.message;
    req.session.message = null; // clear message
    const allArticles = await articlesDao.getArticles();
    let myArticles = [];
    const user = req.session.user || null; // you're either logged in or not

    if (user) {
        myArticles = await articlesDao.getArticlesByAuthor(user.id);
    }
    res.render("home", {
        user,
        allArticles,
        myArticles,
        message
    });
});

// Route handlers for reading articles
router.get("/articles/:id/read", async function (req, res) {
    const id = Number(req.params.id);
    const article = await articlesDao.getArticleById(id);
    
    res.render("articles/read", { article });
});

// Route to request articles in the sort order passed by URL and respond with json
router.get("/articles/", async function (req, res) {
    const { sort } = req.query;
    const articles = await articlesDao.getArticles(sort);
    res.json(articles);
});

router.post("/articles", middleware.verifyAuthenticated, upload.single("imageFile"), async function (req, res) {
    
    // Get user
    const author_id = req.session.user.id;
    
    // Upload image
    let newFileName = "";
    const fileInfo = req.file;
    if (fileInfo) {
        // Move the image into the images folder
        const oldFileName = fileInfo.path;
        newFileName = `/public/images/${fileInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
    };
    // Get form data
    const { title, content } = req.body;

    const article = { author_id, title, content, image_path: newFileName };   
    
    // Create new article
    const newArticle = await articlesDao.createArticle(article);
    res.redirect("/");
});

router.get("/articles/new", middleware.verifyAuthenticated, function (req, res) {
    res.render("articles/new");
});

// Route handlers for editing articles
router.get("/articles/:id/edit", middleware.verifyAuthenticated, async function (req, res) {
    const id = Number(req.params.id);
    const article = await articlesDao.getArticleById(id);
    
    res.render("articles/edit", { article });
});

router.post("/articles/:id/edit", middleware.verifyAuthenticated, upload.single("imageFile"), async function (req, res) {
    // Get article id
    const id = Number(req.params.id);
    // Get form data
    const { title, content } = req.body;
    let newFileName = req.body.image_path;
    
    if (req.file) {
        // User uploaded an image
        const fileInfo = req.file;
        if (fileInfo) {
            // Move the image into the images folder
            const oldFileName = fileInfo.path;
            newFileName = `./public/images/${fileInfo.originalname}`;
            fs.renameSync(oldFileName, newFileName);
        };
    };
    const article = { id, title, content, image_path: newFileName };
    
    const updatedArticle = await articlesDao.updateArticleById(article);

    req.session.message = "Article republished successfully.";

    res.redirect("/");
});

// Route handler for article deletion
router.post("/delete", middleware.verifyAuthenticated, async function (req, res) {

    id = req.body.articleId;
    
    await articlesDao.deleteArticle(id);
    req.session.message = "Article successfully deleted.";
    res.redirect("/");
});

module.exports = router;
const express = require("express");
const router = express.Router();
const fs = require("fs");

const middleware = require("../middleware/auth.js");
const upload = require("../middleware/upload");
const articlesDao = require("../modules/articles-dao.js");
const likesDao = require("../modules/likes-dao.js");
const commentsDao = require("../modules/comments-dao.js");

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
    const user = req.session.user;
    
    const article = await articlesDao.getArticleById(id);
    
    const like_count = await likesDao.countLikes(id);
    
    // Check if user is logged in and has liked the article
    let hasLiked = false;
    if (user) {
      hasLiked = await likesDao.hasLikedArticle(user.id, id);
    };

    res.render("articles/read", { user, article, like_count, hasLiked });
});

// Route handler for liking an article
router.post("/articles/:id/like", middleware.verifyAuthenticated, async function (req, res) {
    const user_id = req.session.user.id;
    const article_id = Number(req.params.id);
    
    const hasLiked = await likesDao.hasLikedArticle(user_id, article_id);
    if (hasLiked) {
        // article has been liked by the user, so unlike it
        await likesDao.unlikeArticle(user_id, article_id);
    } else {
        // article hasn't been liked by the user, so like it
        await likesDao.likeArticle(user_id, article_id);
    };
    
    res.redirect(`/articles/${article_id}/read`);

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

router.post("/articles/:id/comment", middleware.verifyAuthenticated, async function (req, res) {
    // Get article id
    const id = Number(req.params.id);
    // Get user
    const author_id = req.session.user.id;
    // Get comment and parent_id (if it exists) from body
    const { comment, parent_id } = req.body;

    res.redirect(`/articles/${article_id}/read`);
});

module.exports = router;
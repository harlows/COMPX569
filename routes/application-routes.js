const express = require("express");
const router = express.Router();
const fs = require("fs");

const middleware = require("../middleware/auth.js");
const upload = require("../middleware/upload");
const { buildComments } = require("../modules/build-comments.js");
const articlesDao = require("../modules/articles-dao.js");
const likesDao = require("../modules/likes-dao.js");
const commentsDao = require("../modules/comments-dao.js");
const imageGenerator = require("../modules/image-generator.js");

// Whenever we navigate to /, display all articles and check if we're authenticated.
router.get("/", async function(req, res) {
    const user = req.session.user;
    const message = req.session.message;
    req.session.message = null; // clear message
    const allArticles = await articlesDao.getArticles();
    
    
    res.render("home", {
        user,
        allArticles,
        message
    });
});

// Dashboard page displays all user's articles if they are logged in
router.get("/account/dashboard", middleware.verifyAuthenticated, async function(req, res) {
    const user = req.session.user;
    if (user) {
        myArticles = await articlesDao.getArticlesByAuthor(user.id);
    }
        res.render("account/dashboard", {
        user,
        myArticles
    });
});

// Route handlers for reading articles. No need to be logged in
router.get("/articles/:id/read", async function (req, res) {
    
    const id = Number(req.params.id);
    const user = req.session.user;
    
    const article = await articlesDao.getArticleById(id);
    
    const like_count = await likesDao.countLikes(id);
    
    const comments = await commentsDao.getComments(id);

    // Add a flag to mark whether a user can delete a comment and format date
    comments.forEach((c) => {
        // Can delete if the user is logged in,
        if(user) {
            c.canDelete = c.author_id === user.id || // the author of the commet OR
            article.author_id === user.id;           // the author of the comment
        } else {
            c.canDelete = false; // Not logged in
        }
        c.date = c.date.toLocaleString("en-NZ");
        c.article_id = article.id; // Attach to comments to pass to view
      });

    const nestedComments = buildComments(comments);
    
    // Check if user is logged in and has liked the article
    let hasLiked = false;
    if (user) {
      hasLiked = await likesDao.hasLikedArticle(user.id, id);
    };
    
    res.render("articles/read", { user, article, like_count, hasLiked, comments: nestedComments });
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

// Endpoint to request articles in the sort order and respond with json
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

    if (req.file) {
        const fileInfo = req.file;
    
        const oldFileName = fileInfo.path;
    
        const filePath = `./public/images/${fileInfo.originalname}`;
        const publicPath = `/public/images/${fileInfo.originalname}`;
    
        fs.renameSync(oldFileName, filePath);
    
        newFileName = publicPath;
    };
    // Get form data
    const { title, content } = req.body;

    const article = { author_id, title, content, image_path: newFileName };   
    
    // Create new article
    const newArticle = await articlesDao.createArticle(article);

    req.session.message = "Article published successfully.";

    res.redirect("/account/dashboard");
});

router.get("/articles/new", middleware.verifyAuthenticated, function (req, res) {
    const user = req.session.user;
    
    res.render("articles/new", { user });
});

// Route handlers for editing articles
router.get("/articles/:id/edit", middleware.verifyAuthenticated, async function (req, res) {
    const user = req.session.user;
    const id = Number(req.params.id);
    const article = await articlesDao.getArticleById(id);
    
    res.render("articles/edit", { article, user });
});

router.post("/articles/:id/edit", middleware.verifyAuthenticated, upload.single("imageFile"), async function (req, res) {
    // Get article id
    const id = Number(req.params.id);
    
    // Get form data
    const { title, content } = req.body;

    // Get existing data
    const existingArticle = await articlesDao.getArticleById(id);

    let newFileName = existingArticle.image_path;

    if (req.file) {
        const fileInfo = req.file;
    
        const oldFileName = fileInfo.path;
    
        const filePath = `./public/images/${fileInfo.originalname}`;
        const publicPath = `/public/images/${fileInfo.originalname}`;
    
        fs.renameSync(oldFileName, filePath);
    
        newFileName = publicPath;
    };

    const article = { id, title, content, image_path: newFileName };
    
    const updatedArticle = await articlesDao.updateArticleById(article);

    req.session.message = "Article republished successfully.";

    res.redirect("/account/dashboard");
});

// Route handler for AI cover image generation
router.post("/articles/:id/generate-cover", middleware.verifyAuthenticated, async function (req, res) {
    // TODO: Add error capture
    // Get article id and user
    const id = Number(req.params.id);
    const user = req.session.user;

    // Get the article
    const article = await articlesDao.getArticleById(id);

    // Call image generator function
    const imageUrl = await imageGenerator.generateCoverImage(article.title);
    article.image_path = imageUrl;
    // Update DB
    await articlesDao.updateArticleById(article);

    req.session.message = "AI cover image generated successfully.";

    res.redirect(`/articles/${id}/edit`);

});

// Route handler for article deletion
router.post("/delete", middleware.verifyAuthenticated, async function (req, res) {

    id = req.body.articleId;
    
    await articlesDao.deleteArticle(id);
    req.session.message = "Article successfully deleted.";
    res.redirect("/account/dashboard");
});

router.post("/articles/:id/comment", middleware.verifyAuthenticated, async function (req, res) {
    // Get article id
    const article_id = Number(req.params.id);
    // Get user
    const user_id = req.session.user.id;
    // Get comment and parent_id (if it exists) from body
    const comment = req.body.comment;
    const parent_id = req.body.parent_id;

    const postComment = await commentsDao.createComment(user_id, article_id, parent_id, comment);

    req.session.message = "Comment posted successfully.";

    res.redirect(`/articles/${article_id}/read`);
});

router.post("/comments/:id/delete", middleware.verifyAuthenticated, async function (req, res) {
    // Get comment and article id
    const comment_id = Number(req.params.id);
    const article_id = req.body.article_id;

    await commentsDao.deleteComment(comment_id);
    
    req.session.message = "Comment successfully deleted.";  

    res.redirect(`/articles/${article_id}/read`);
});

module.exports = router;
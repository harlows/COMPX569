const database = require("./database.js");

async function createArticle(article) {
    const db = await database;

    const result = await db.query(
        "insert into articles (author_id, title, content, image_path) values (?, ?, ?, ?)",
        [article.author_id, article.title, article.content, article.image_path]);

    article.id = result.insertId;

    return article;
}

// Get all articles from the database, default sort order is by date
async function getArticles(sort) {
    const db = await database;
    let orderBy = "created_at desc";
    if ( sort === "title") orderBy = "title asc";
    if ( sort === "username") orderBy = "author asc";

    const articles = await db.query(
        `select a.id as id, a.created_at as date, u.name as author, a.title as title, a.content as content from articles as a, users as u where a.author_id = u.id order by ${orderBy}`);

    return articles;
}

// Get articles by author
async function getArticlesByAuthor(id) {
    const db = await database;

    const articles = await db.query(
        "select id as id, title as title, content as content from articles where author_id = ? order by created_at",
        [id]);

    return articles;
}

// Retrieve an article by id
async function getArticleById(id) {
    const db = await database;

    const article = await db.query(
        "select a.id, a.title, a.content, a.image_path, a.created_at, u.username as author from articles as a, users as u where a.author_id = u.id and a.id = ?",
        [id]);

    return article[0];
}

// Update an article in the database after editting
async function updateArticleById(article) {
    const db = await database;

    await db.query("update articles set title = ?, content = ?, image_path = ? where id = ?",
        [article.title, article.content, article.image_path, article.id]
    );
}

// Delete article from the database
async function deleteArticle(id) {
    const db = await database;

    await db.query("delete from articles where id = ?", [id]);
}

// Export functions
module.exports = {
    createArticle,
    getArticles,
    getArticlesByAuthor,
    getArticleById,
    updateArticleById,
    deleteArticle
};
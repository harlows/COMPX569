const database = require("./database.js");

async function createArticle(article) {
    const db = await database;

    const result = await db.query(
        "insert into articles (author_id, title, content) values (?, ?, ?)",
        [article.author_id, article.title, article.content]);

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
        `select u.name as author, a.title as title, a.content as content from articles as a, users as u where a.author_id = u.id order by ${orderBy}`);

    return articles;
}

// Get articles by author
async function getArticlesByAuthor(id) {
    const db = await database;

    const articles = await db.query(
        "select title as title, content as content from articles where author_id = ? order by created_at",
        [id]);

    return articles;
}

// Export functions
module.exports = {
    createArticle,
    getArticles,
    getArticlesByAuthor
};
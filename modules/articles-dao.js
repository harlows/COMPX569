const database = require("./database.js");

async function createArticle(article) {
    const db = await database;

    const result = await db.query(
        "insert into articles (author_id, title, content) values (?, ?, ?)",
        [article.author_id, article.title, article.content]);

    article.id = result.insertId;

    return article;
}

// Get all articles from the database ordered by creation date
async function getArticles() {
    const db = await database;

    const articles = await db.query(
        "select title as title, content as content from articles order by created_at");
    return await articles;
}

// Export functions
module.exports = {
    createArticle,
    getArticles
};
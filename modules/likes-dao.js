const database = require("./database.js");

// Has a user already liked an artice?
async function hasLikedArticle(user_id, article_id) {
    const db = await database;

    const row = await db.query("select 1 from likes where user_id = ? and article_id = ?",
        [user_id, article_id]);
    
    return row[0];
}

// Like or unlike articles
async function likeArticle(user_id, article_id) {
    const db = await database;

    await db.query("insert into likes (user_id, article_id) values (?, ?)",
        [user_id, article_id]);
}

async function unlikeArticle(user_id, article_id) {
    const db = await database;

    await db.query("delete from likes where user_id = ? and article_id = ?",
        [user_id, article_id]);
}

// Export functions
module.exports = {
    hasLikedArticle,
    likeArticle,
    unlikeArticle
};
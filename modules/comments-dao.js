const database = require("./database.js");

// Create a comment on an article
async function createComment(user_id, article_id) {
    const db = await database;

    await db.query("insert into comments (user_id, article_id, parent_id, comment) values (?, ?, ?)",
        [user_id, article_id, parent_id, comment]);
}

// Export functions
module.exports = {
    createComment
};
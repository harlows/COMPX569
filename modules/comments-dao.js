const database = require("./database.js");

// Create a comment on an article
async function createComment(user_id, article_id, parent_id, comment) {
    const db = await database;

    await db.query("insert into comments (user_id, article_id, parent_id, comment) values (?, ?, ?, ?)",
        [user_id, article_id, parent_id, comment]);
}

// Get comments for an article
async function getComments(article_id) {
    const db = await database;

    const comments = await db.query("select c.id, c.user_id as author_id, c.parent_id, c.comment, c.created_at as date, u.username from users as u, comments as c where u.id = c.user_id and c.article_id = ? order by c.created_at asc",
        [article_id]);
        
    return comments;
}

// Delete comment from the database
async function deleteComment(id) {
    const db = await database;

    await db.query("delete from comments where id = ?", [id]);
}

// Export functions
module.exports = {
    createComment,
    getComments,
    deleteComment
};
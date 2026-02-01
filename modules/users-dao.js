const database = require("./database.js");

// Get user details from database
async function getUserById(id) {
    const db = await database;
    // Format date to avoid javascript conversion to NZST
    const result = await db.query(
        "select id, username, password, name, date_format(dob, '%Y-%m-%d') as dob, description, avatar from users where id = ?", [id]);

    return result;
}

// Add user to the database
async function createUser(user) {
    const db = await database;
    
    const result = await db.query(
        "insert into users (username, password, name, dob, avatar, description) values (?, ?, ?, ?, ?, ?)",
        [user.username, user.password, user.name, user.dob, user.avatar, user.description]);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = result.insertId;

    return user;
}

// Find whether a username is already taken
async function checkUsername(username) {
    const db = await database;

    const result = await db.query("select * from users where username = ? limit 1",
    [username]);
    
    return result[0] || null;
}

// Update user's profile
async function updateUser(user) {
    const db = await database;

    await db.query("update users set username = ?, password = ?, name = ?, dob = ?, description = ? where id = ?",
        [user.username, user.password, user.name, user.dob, user.description, user.id]
    );
}

// Delete user with the given id from the database
// Will delete all user's articles automatically because database schema uses ON DELETE CASCADE
async function deleteUser(id) {
    const db = await database;

    await db.query("delete from users where id = ?", [id]);
}

// Export functions.
module.exports = {
    getUserById,
    createUser,
    checkUsername,
    updateUser,
    deleteUser
};
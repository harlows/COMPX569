const database = require("./database.js");

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

// Export functions.
module.exports = {
    createUser,
    checkUsername
};
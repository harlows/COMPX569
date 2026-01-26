const database = require("./database.js");

// Add user to the database
async function createUser(user) {
    const db = await database;

    const result = await db.query(
        "insert into users (username, password, name, dob, description) values (?, ?, ?, ?, ?)",
        [user.username, user.password, user.name, user.dob, user.description]);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = result.insertId;

    return user;
}

// Export functions.
module.exports = {
    createUser
};
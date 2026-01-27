const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");
const {createUser} = require("../modules/users-dao");
const {checkUsername} = require("../modules/users-dao");


router.get("/login", function (req, res) {

    res.locals.message = req.query.message;
    res.render("account/login");

});

router.post("/login", async function (req, res) {

});

// Route handler for logging user out
router.get("/logout", function (req, res) {

});

// Route handler for account creation
router.get("/create", function (req, res) {
    res.render("account/create");
});

router.post("/create", async function (req, res) {
    // Get form data
    const { username, password, name, dob, description } = req.body;
    const user = { username, password, name, dob, description };
    
    // Create new user
    const newUser = await userDao.createUser(user);
    // Redirect to login page
    if (newUser) {
        res.redirect("./login?message=Account created successfully!");
    }    
});

// Route handler for checking if a username exists
router.get("/check-username", async function (req, res) {
    const { username } = req.query;
    console.log("Checking username:", username);

    const user = await userDao.checkUsername(username);
    console.log("User from DB:", user);

    res.json({ available : !user });

});

module.exports = router;
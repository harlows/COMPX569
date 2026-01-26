const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");
const {createUser} = require("../modules/users-dao");

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

// Route handler for username checking
router.get("/username", function (req, res) {
    const { username } = req.query;
    
});

module.exports = router;
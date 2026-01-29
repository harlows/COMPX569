const express = require("express");
const router = express.Router();

const middleware = require("../middleware/auth.js");

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/", middleware.verifyAuthenticated, async function(req, res) {
    
    res.render("home", {
        user: req.session.user,
    });
});

module.exports = router;
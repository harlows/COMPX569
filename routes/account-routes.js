const express = require("express");
const argon2 = require("argon2");
const router = express.Router();

const middleware = require("../middleware/auth.js");

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");

// Whenever we navigate to ANY page, make the "user" session object available to the
// Handlebars engine by adding it to res.locals.
router.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
});

// Whenever we navigate to /login, if we're already logged in, redirect to "/".
// Otherwise, render the "login" view, supplying the given "message" query parameter
// to the view engine, if any.
router.get("/login", function (req, res) {

    if (req.session.user) {
        res.redirect("/");
    }

    else {
        res.locals.message = req.query.message;
        res.render("account/login");
    }

});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, add that user to the session and redirect to "/".
// Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {
    
    // Get the username and password submitted in the form
    const { username, password } = req.body;
    // Find a matching user in the database by username
    const user = await userDao.checkUsername(username);
    
    if (!user) {
        // User not found so return
        return res.redirect("./login?message=User not found!");
    }
    console.log(`User ${username} found`);

    // Verify password with stored hash
    const isVerified = await argon2.verify(user.password, password);
    console.log(`Password is ${isVerified}`);
    
    if (isVerified) {
        // Auth success - add the user to the session, and redirect to the homepage.
        req.session.user = user;
        console.log(req.session.user.name);
        
        res.redirect("/");
    } else { // Wrong password!
        res.redirect("./login?message=Authentication failed!");
    }
});

// Route handler for logging user out
router.get("/logout", function (req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect("/");
});

// Route handlers for account creation and password hashing
router.get("/create", function (req, res) {
    res.render("account/create", {
     avatars: [
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=AB&size=80" },
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=CD&size=80" },
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=EF&size=80" }
      ]
    });
});

router.post("/create", async function (req, res) {
    // Get form data
    const { username, password1, name, dob, avatar, description } = req.body;
    
    // Hash password
    const passwordHash = await argon2.hash(password1);

    const user = { username, password: passwordHash, name, dob, avatar, description };
    
    // Create new user
    const newUser = await userDao.createUser(user);
    
    // Redirect to login page
    if (newUser) {
        res.redirect("./login?message=Account created successfully!");
    }    
});

// Route handler to display profile page if logged in
router.get("/profile", middleware.verifyAuthenticated, async function (req, res) {
    
    // Don't use session data, instead read from the database
    const rows = await userDao.getUserById(req.session.user.id);
    const user = rows[0];
    // Never display password
    res.render("account/profile", {
        user : {
            username: user.username,
            name: user.name,
            dob: user.dob,
            avatar: user.avatar,
            description: user.description
     },
     avatars: [
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=AB&size=80" },
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=CD&size=80" },
        { url: "https://api.dicebear.com/9.x/croodles/svg?seed=EF&size=80" }
      ]
    });
});

// Route handler to update a user's profile
router.post("/profile", middleware.verifyAuthenticated, async function (req, res) {
    // Get id and username from session
    const userId = req.session.user.id;
    
    // Get form data
    const { username, password1, password2, name, dob, avatar, description } = req.body;
    // Get current user from the database
    const currentUser = await userDao.getUserById(userId);

    // Only check username if usernames have changed
    if (username !== currentUser.username) {
        const userExists = await userDao.checkUsername(username);
        if (userExists) {
            // disable submit button
            console.log("User exists");
        };
    }
    // Only update password if it has changed
    if (password1 && password2) {
        if (password1 !== password2) {
            // disable submit button
            console.log("User exists");
        };
        const passwordHash = await argon2.hash(password1);
        await userDao.updatePassword(userId, passwordHash);
    };
    
    // Update the rest of the user profile
    const user = { id: userId, username, name, dob, avatar, description };
    const updateUser = await userDao.updateUser(user);

    // Update session details
    req.session.user.name = name;

    req.session.message = "Profile successfully updated.";
    res.redirect("/");
});

// Route handler for user account deletion
router.post("/delete", middleware.verifyAuthenticated, async function (req, res) {

   const user = req.session.user.id;

   await userDao.deleteUser(user);

   // Log user out by destroying their session
   req.session.destroy( () => {
    res.redirect("./login?message=Your account has been deleted.");
   })

});

// Route handler for checking if a username exists
router.get("/check-username", async function (req, res) {
    const { username } = req.query;
    console.log("Checking username:", username);

    const user = await userDao.checkUsername(username);
    console.log("User from DB:", user);
    // if user returns null then username is available
    res.json({ available : !user });

});

module.exports = router;
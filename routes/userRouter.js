const express = require("express");

const router = require("express-promise-router")();
const passport = require("passport");
const {
    schemas,
    requestParam,
    requestBody,
    
} = require("../helperControllers/helperControllers");
const UserController = require("../controllers/userController.js"); 

router
    .route("/") // localhost:3000/users
    .get(UserController.index)
    .post(requestBody(schemas.usernameBody), UserController.newUser);

// router
//     .route("/:userID")
//     .get(requestParam(schemas.IDSchemas, "userID"), UserController.getUser)
//     .put(
//         requestParam(schemas.IDSchemas, "userID"),
//         requestBody(schemas.usernameBody),
//         UserController.replaceUser
//     )
//     .patch(
//         requestParam(schemas.IDSchemas, "userID"),
//         requestBody(schemas.usernameOptionsBody),
//         UserController.updateUser
//     );
router
    .route("/secret/Secrets")
    .get(
        passport.authenticate("jwt", { session: false }),
        UserController.Secret
    );

router
    .route("/SignUp")
    .post(requestBody(schemas.AuthenticationSignUp), UserController.SignUp);
router
    .route("/SignIn")
    .post(
        requestBody(schemas.AuthenticationSignIn),
        passport.authenticate("local", { session: false }),
        UserController.SignIn
    );

router.post(
    "/auth/google",
    passport.authenticate("google-plus-token", { session: false }),
    UserController.AuthGoogle
); // phải config passport.js

router.post(
    "/auth/facebook/token",
    passport.authenticate("facebook-token", { session: false }),
    UserController.AuthFacebook
);

module.exports = router;
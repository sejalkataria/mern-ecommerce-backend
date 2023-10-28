const express = require('express');
const { createUser, loginUser, checkUser } = require('../controller/Auth');
const passport = require('passport');
const router = express.Router();

router.post('/signup', createUser)
    .get('/check', passport.authenticate('jwt'), checkUser)
    .post('/login', passport.authenticate('local'), loginUser)


exports.router = router;
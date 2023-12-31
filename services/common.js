const passport = require('passport');

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt')
}

exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role }
}

exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    //this is temporary token for testing without cookie
    //admin
    // token = process.env.TOKEN_ADMIN
    //demo
    token = process.env.TOKEN_DEMO
    return token;
}

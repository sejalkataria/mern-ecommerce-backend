const express = require('express');
require('dotenv').config();
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Category');
const brandsRouters = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');
const { User } = require('./model/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const PORT = process.env.PORT;


//JWT options
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

//middlewares
// server.use(express.static('build'))
server.use(cookieParser());
server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));

server.use(passport.authenticate('session'));

server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
//middlewares
server.use(express.json()); //to parse req.body
server.use('/products', isAuth(), productsRouter.router);
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouters.router);
server.use('/users', isAuth(), usersRouter.router);
server.use('/auth', authRouter.router)
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', isAuth(), ordersRouter.router);

//passport strategies
passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: 'invalid credentials' })
            }
            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                    if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                        return done(null, false, { message: 'invalid credentials' })
                    }
                    const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
                    done(null, { token }) //this line sends to serializer
                })
        }
        catch (err) {
            done(err)
        }
    })
);

passport.use('jwt', new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload.id)
        if (user) {
            return done(null, sanitizeUser(user));
        }
        else {
            return done(null, false);
        }
    } catch (error) {
        return done(err, false);
    }
})
)

//this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, { id: user.id, role: user.role });
    });
});

//this creates session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected!')
}

server.listen(PORT, () => {
    console.log('server started on', PORT)
})
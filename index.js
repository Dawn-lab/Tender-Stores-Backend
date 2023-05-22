require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express()

const PORT = 3000 || process.env.PORT;


mongoose.connect(process.env.MONGO, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.log(error))
db.once("open", () => console.log("Connected to database"));

app.use(cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24*60*60*1000,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}))

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });


app.listen(PORT, console.log(`Listening on port ${PORT}`));
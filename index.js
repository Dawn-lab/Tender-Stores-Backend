require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session")
const app = express()


const PORT = 3000 || process.env.PORT;


app.listen(PORT, console.log(`Listening on port ${PORT}`));